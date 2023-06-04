const fs = require("fs");
const solution  = require("./user_solution");

fs.readFile("../input", (err, input) => {
    if (err) throw err;

    fs.readFile("../output", (err, output) => {
        if (err) throw err;

        const inputs = input.toString().split('\n');
        const outputs = output.toString().split('\n');

        var total = outputs.length;
        var correct = 0;

        for (var i = 0; i < total; i++) {
            const result = solution.solve(inputs[i * 2].split(" ").map(Number), parseInt(inputs[i * 2 + 1]));
            if (JSON.stringify(result) === JSON.stringify(outputs[i].split(" ").map(Number))) correct++;
        }

        console.log("%d/%d test cases passed!", correct, total);
    })
});