class Solution(object):
    def twoSum(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        d = {}
        for idx, num in enumerate(nums):
            if num in d:
                return [idx,d[num]]
            else:
                d[target-num] = idx
        return
        