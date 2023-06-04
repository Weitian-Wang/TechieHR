import java.io.*;
import java.util.*;

public class Grader {
  public static void main(String[] args) {
    try {
      File input = new File("../input");
      File output = new File("../output");
      Scanner inputReader = new Scanner(input);
      Scanner outputReader = new Scanner(output);
      int total = 0, correct = 0;
      Solution solution = new Solution();
      while (inputReader.hasNextLine()) {
        total++;
        int[] nums = Arrays.stream(inputReader.nextLine().split(" ", 0)).mapToInt(Integer::parseInt).toArray();
        int target = Integer.parseInt(inputReader.nextLine());
        int[] ans = Arrays.stream(outputReader.nextLine().split(" ", 0)).mapToInt(Integer::parseInt).toArray();
        int[] result = solution.solve(nums, target);
        if (Arrays.equals(result, ans)) correct++;
      }
      inputReader.close();
      outputReader.close();
      System.out.printf("%d/%d test cases passed!\n", correct, total);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}