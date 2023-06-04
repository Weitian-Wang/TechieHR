# do not edit beyond main function
from user_solution import Solution
# main function for submission handling
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
                    s1 = line.split('\n')[0]
                    s2 = input.readline().split('\n')[0]
                    ans = True if output.readline().split('\n')[0] == "true" else False
                    result = solution.solve(s1, s2)
                    if ans == result:
                        correct += 1
                    line = input.readline()
                print(f'{correct}/{total} test cases passed!')
    except Exception as e:
        print(f'Error occured when running solution: {str(e)}')

if __name__ == "__main__":
    main()