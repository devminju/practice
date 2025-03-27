import { Item, PaginatedResponse } from "./types";

// 실제 API 호출을 시뮬레이션하기 위한 지연 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 아이템 목록을 가져오는 함수
export const fetchItems = async (
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Item>> => {
  await delay(500);

  // 실제 API 응답을 시뮬레이션
  const items: Item[] = Array.from({ length: pageSize }, (_, index) => ({
    id: (page - 1) * pageSize + index + 1,
    title: `아이템 ${(page - 1) * pageSize + index + 1}`,
    createdAt: new Date().toISOString(),
  }));
  console.log("fetchItems", page, pageSize, {
    items,
    total: 100,
    page,
    pageSize,
  });
  return {
    items,
    total: 100,
    page,
    pageSize,
  };
};

// 새로운 아이템을 생성하는 함수
export const createItem = async (title: string): Promise<Item> => {
  await delay(500);

  console.log("createItem", title);

  return {
    id: Math.floor(Math.random() * 1000) + 1000, // 실제로는 서버에서 생성된 ID를 받아옵니다
    title,
    createdAt: new Date().toISOString(),
  };
};
