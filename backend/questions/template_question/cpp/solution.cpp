class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        vector<int> ans;
        unordered_map<int, int> hm;
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            if (hm.find(nums[i]) != hm.end()) {
                ans.push_back(hm[nums[i]]);
                ans.push_back(i);
                break;
            }
            hm[target - nums[i]] = i;
        }
        return ans;
    }
};