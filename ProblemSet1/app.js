const globals = require('./globals');
// fs module import
const fs = require('fs');
// FamilyTree class import
const FamilyTree = require('./family');
// Person class import
const Person = require('./person');
// family tree initialisation
const family = new FamilyTree();

console.log('----------------------- FAMILY TREE SETUP START -----------------------');

// Addition of King Shan to the family tree
const root = new Person(globals.rootName,globals.rootGender);
family.familyMembers.push(root);
let seedCommands  = fs.readFileSync('seed_data.txt').toString().split("\r\n");
for (let command of seedCommands) {
    let args = command.split(" ");
    if(args[0] === 'ADD_CHILD') {
        family.descend(...args.slice(1));
    }
    else if(args[0] === 'ADD_SPOUSE') {
        family.marriage(...args.slice(1));
    }
    else console.log("invalid command");
}
console.log('----------------------- FAMILY TREE SETUP END -----------------------');
let commands = fs.readFileSync('input.txt').toString().split("\r\n");
console.log('----------------------- OUTPUT OF INPUT.TXT FILE -----------------------');
for (let command of commands) {
    let args = command.split(" ");
    if(args[0] === 'ADD_CHILD') {
        family.descend(...args.slice(1));
    }
    else if(args[0] === 'GET_RELATIONSHIP') {
        family.getRelationship(...args.slice(1));
    }
    else console.log("invalid command");
}
console.log('----------------------- END -----------------------');

