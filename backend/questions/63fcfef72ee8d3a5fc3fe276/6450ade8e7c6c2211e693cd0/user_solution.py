class Solution(object):
    def solve(self, s, t):
        """
        :type s: str
        :type t: str
        :rtype: bool
        """
        d = {}
        for c in s:
            d[c] = d.get(c, 0) + 1
        for c in t:
            if c not in d:
                return False
            else:
                d[c] -= 1
        for k, v in d.items():
            if v != 0:
                return False
        return True