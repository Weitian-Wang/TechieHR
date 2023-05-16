# do not edit beyond main function
try:
    from user_solution import Solution
except ImportError:
    from solution import Solution
# main function for submission handling
def main():
    try:
        solution = Solution()
        input = open('input', 'r')
        input_lines = input.readlines()
        idx = 0
        # generate user_output for grading
        user_output = open('user_output', 'w+')
        while idx < len(input_lines):
            # convert line into input data
            s1 = input_lines[idx].strip('\n')
            idx += 1
            s2 = input_lines[idx].strip('\n')
            idx += 1
            result = solution.solve(s1, s2)
            user_output.write(str(result)+'\n')
        
        # test case tally
        output = open('output', 'r')
        output_lines = output.readlines()
        user_output = open('user_output', 'r')
        user_output_lines = user_output.readlines()
        case_count, correct_count = 0, 0
        idx = 0
        while idx < len(output_lines):
            if not output_lines[idx]:
                break
            if user_output_lines[idx].strip('\n') == output_lines[idx].strip('\n'):
                correct_count += 1
            case_count += 1
            idx += 1
        # use print for messages for test taker
        print(f'{correct_count}/{case_count} test cases passed!')
    except Exception as e:
        print(f'Error occured when running solution: {str(e)}')



if __name__ == "__main__":
    main()