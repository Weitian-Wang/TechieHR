/**
 * @param {Number[]} nums
 * @param {Number} target
 * @return {Number[]}
 */
var solve = function(nums, target) {
    const map = new Map();
    for(let i=0; i<nums.length; i++){
        const complement = target - nums[i];
        if(map.has(complement))
            return [map.get(complement), i];
        map.set(nums[i], i);
    }
    return [];
};

// Do NOT edit below
exports.solve = solve;