from solution import Solution

# define classes

# main function for submission handling
def main():
    solution = Solution()
    input = open('input', 'r')
    input_lines = input.readlines()
    # generate user_output for grading
    user_ouput = open('user_output', 'w+')
    for line in input_lines:
        # convert line into input data
        result = solution.solve(line)
        user_ouput.write(result)

if __name__ == "__main__":
    main()