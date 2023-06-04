#include <bits/stdc++.h>
using namespace std;

#include "user_solution.cpp"

int main() {
    try {
        ifstream input("../input"), output("../output");
        string line;
        int amount = 0, count = 0;
        while (getline(input, line)) {
            if (line.size() == 0) break;
            istringstream iss(line);
            vector<int> v;
            int elm;
            while (iss >> elm) v.push_back(elm);
            getline(input, line);
            int target = stoi(line);
            Solution solution;
            v = solution.solve(v, target);
            string ans;
            int n = v.size();
            for (int i = 0; i < n; i++) {
                ans += to_string(v[i]);
                if (i != n - 1) ans += ' ';
            }
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