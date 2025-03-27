/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchItems, createItem } from "./api";
import { Item } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Pagination,
  Box,
} from "@mui/material";

const ITEMS_PER_PAGE = 10;

function App() {
  const [page, setPage] = useState(1);
  const [newItemTitle, setNewItemTitle] = useState("");
  const queryClient = useQueryClient();

  // 아이템 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["items", page],
    queryFn: () => fetchItems(page, ITEMS_PER_PAGE),
  });

  // 아이템 생성
  const createItemMutation = useMutation({
    mutationFn: createItem,
    onMutate: async () => {
      // 이전 데이터 백업:onError에서 사용하기 위함
      const previousItems = queryClient.getQueryData(["items", 1]);
      // 1페이지로 이동: onSuccess에서 하면 퀴리키가 변하기 때문에 다시 useQuery 호출하기 떄문에 onMutate에서 처리
      if (page !== 1) {
        setPage(1);
      }

      return { previousItems };
    },
    onSuccess: (newItem) => {
      // setQueryData를 사용하여 캐시 업데이트
      queryClient.setQueryData(["items", 1], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: [newItem, ...oldData.items],
          total: oldData.total + 1,
        };
      });

      // 다른 페이지의 데이터는 무효화
      queryClient.invalidateQueries({
        queryKey: ["items"],
        predicate: (query) => {
          return query.queryKey[1] !== 1;
        },
      });
    },
    onError: (_error, _newItem, context?: { previousItems: any }) => {
      // 이전 데이터 복구
      if (context?.previousItems) {
        queryClient.setQueryData(["items", 1], context.previousItems);
      }
    },
  });

  const handleCreateItem = () => {
    if (!newItemTitle.trim()) return;
    createItemMutation.mutate(newItemTitle);
    setNewItemTitle("");
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="새 아이템 제목"
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleCreateItem}
          disabled={createItemMutation.isPending}
        >
          아이템 추가
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>생성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.items.map((item: Item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil((data?.total || 0) / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default App;
