import os
from user_solution import Solution

def main():
    try:
        solution = Solution()
        with open("../input") as input:
            with open("../output") as output:
                line = input.readline()
                total = 0
                correct = 0
                while line:
                    total += 1
                    nums = list(map(int, line.split()))
                    target = int(input.readline())
                    ans = list(map(int, output.readline().split()))
                    result = solution.solve(nums, target)
                    if ans == result:
                        correct += 1
                    line = input.readline()
                print(f'{correct}/{total} test cases passed!')
    except Exception as e:
        print(f'Error occured when running solution: {str(e)}')



if __name__ == "__main__":
    main()