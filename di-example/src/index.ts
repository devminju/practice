import { createContainer, asClass, InjectionMode } from 'awilix';
import { IUserService } from './interfaces';
import { InMemoryUserRepository, UserService } from './implementations';

// 컨테이너 생성
const container = createContainer();

// 의존성 등록
container.register({
  userRepository: asClass(InMemoryUserRepository).singleton(),
  userService: asClass(UserService).singleton()
});

// 의존성 주입을 통해 서비스 인스턴스 가져오기
const userService = container.resolve<IUserService>('userService');

// 사용 예시
async function main() {
  try {
    // 사용자 생성
    const newUser = await userService.createUser('홍길동', 'hong@example.com');
    console.log('생성된 사용자:', newUser);

    // 사용자 조회
    const user = await userService.getUserById(newUser.id);
    console.log('조회된 사용자:', user);
  } catch (error) {
    console.error('에러:', error);
  }
}

main(); 