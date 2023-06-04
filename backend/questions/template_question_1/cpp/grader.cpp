#include <bits/stdc++.h>
using namespace std;

#include "user_solution.cpp"

int main() {
    try {
        ifstream input("../input"), output("../output");
        string s, t, line;
        int amount = 0, count = 0;
        while (getline(input, s)) {
            if (s.size() == 0) break;
            getline(input, t);
            Solution solution;
            bool ret = solution.solve(s, t);
            string ans = "false";
            if (ret) ans = "true";
            amount++;
            getline(output, line);
            if (ans == line) count++;
        }
        input.close();
        cout << count << "/" << amount << " test cases passed!" << endl;
    } catch (const exception& e) {
        cout << "Error occured when running solution: " << e.what() << endl;
    }
    return 0;
}