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
        String s1 = inputReader.nextLine();
        String s2 = inputReader.nextLine();
        boolean ans  = outputReader.nextLine().equals("true");
        boolean result = solution.solve(s1, s2);
        if (result == ans) correct++;
      }
      inputReader.close();
      outputReader.close();
      System.out.printf("%d/%d test cases passed!\n", correct, total);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}