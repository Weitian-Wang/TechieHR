class Solution(object):
    def solve(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        seen = {}
        for idx,num in enumerate(nums):
            if num in seen:
                return [seen[num], idx]
            seen[target-num] = idx
        return