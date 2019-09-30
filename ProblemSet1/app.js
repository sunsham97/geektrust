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
const root = new Person('Shan','Male');
family.familyMembers.push(root);

// Shan marries Anga
family.addSpouse('Shan','Anga');
// Shan and Anga's Children and their spouses
family.addChildren(root,'Anga','Chit','Male');
// Chit marries Amba
family.addSpouse('Chit','Amba');
family.addChildren(root,'Anga','Ish','Male');
family.addChildren(root,'Anga','Vich','Male');
// Vich marries Lika
family.addSpouse('Vich','Lika');
family.addChildren(root,'Anga','Aras','Male');
// Aras marries Chitra
family.addSpouse('Aras','Chitra');
family.addChildren(root,'Anga','Satya','Female');
// Satya marries Vyan
family.addSpouse('Satya','Vyan');

// Chit and Amba's children and their spouses
family.addChildren(root,'Amba','Dritha','Female')
// Dritha marries Jaya
family.addSpouse('Dritha','Jaya');
family.addChildren(root,'Amba','Tritha','Female');
family.addChildren(root,'Amba','Vritha','Male');

// Dritha and Jaya's childen
family.addChildren(root,'Dritha','Yodhan','Male');

// Vich and Lika's children
family.addChildren(root,'Lika','Vila','Female');
family.addChildren(root,'Lika','Chika','Female');

// Aras and Chitra's children and their spouses
family.addChildren(root,'Chitra','Jnki','Female');
// Jnki marries Arit
family.addSpouse('Jnki','Arit');
family.addChildren(root,'Chitra','Ahit','Male');

// Arit and Jnki's children
family.addChildren(root,'Jnki','Laki','Male');
family.addChildren(root,'Jnki','Lavnya','Female');

// Satya and Vyan's children and their spouses
family.addChildren(root,'Satya','Asva','Male');
// Asva marries Satvy
family.addSpouse('Asva','Satvy');
// Asva and Satvy's children
family.addChildren(root,'Satvy','Vasa','Male');

family.addChildren(root,'Satya','Vyas','Male');
// Vyas marries Krpi
family.addSpouse('Vyas','Krpi');

// Vyas and Krpi's children
family.addChildren(root,'Krpi','Kriya','Male');
family.addChildren(root,'Krpi','Krithi','Female');

family.addChildren(root,'Satya','Atya','Female');
console.log('----------------------- FAMILY TREE SETUP END -----------------------');
let commands = fs.readFileSync('input.txt').toString().split("\r\n");
console.log('----------------------- OUTPUT OF INPUT.TXT FILE -----------------------');
for (let command of commands) {
    let args = command.split(" ");
    if(args[0] === 'ADD_CHILD') {
        family.addChildren(root,...args.slice(1));
    }
    else if(args[0] === 'GET_RELATIONSHIP') {
        family.getRelationship(...args.slice(1));
    }
    else console.log("invalid command");
}
console.log('----------------------- END -----------------------');