// 무리에 근접해있을 때, 일정 거리를 유지하기 위하여 무리를 벗어나야함
export default interface SeparationBehavior{
    separte(): void;
}