// module imports
const fs = require('fs');
// family registry
const family = [];
// member definition
class Person {
    // class variables
    // below declarations work in the latest node version
    // name = '';
    // gender = '';
    // spouse =  null;
    // parent = null;
    // children = [];

    // class methods
    constructor(name,gender,parent=null) {
        this.name = name;
        this.gender = gender;
        this.parent = parent;
        this.spouse = null;
        this.children = [];
    }
    static addChildren(root,motherName,childName,childGender) {
        let mother = findFamilyMember(motherName);
        if(mother && mother.gender === 'Female' && mother.spouse) {
            if ((root.gender === 'Female' && root.name === motherName && root.spouse) || (root.gender === 'Male' && root.spouse && root.spouse.name === motherName)) {
                console.log('CHILD_ADDITION_SUCCEEDED');
                family.push(new Person(childName,childGender,root));
                root.children.push(family[family.length-1]);
                root.spouse.children = root.children;
                return true;
            }
            else if (root.spouse && root.children.length){
                // console.log('Passed from',root.name)
                for (let child of root.children) {
                    // console.log(`${child.name}'s tree`)
                    let result = this.addChildren(child,motherName,childName,childGender);
                    if(result) return true;
                }
            } else {
                // console.log(`not found in ${root.name}'s tree`);
                return false;
            }
        } else {
            if (!mother) console.log('PERSON_NOT_FOUND');
            else console.log('CHILD_ADDITION_FAILED');
            return;
        }
    }

    static addSpouse(memberName,spouseName) {
        let member  = findFamilyMember(memberName);
        if (member) {
            let memberIndex = family.indexOf(member);
            let spouseGender = (member.gender === 'Male') ? 'Female': 'Male';
            let spouse = new Person(spouseName,spouseGender);
            member.spouse = spouse;
            spouse.spouse = member;
            family[memberIndex] = member;
            family.push(spouse);
            // console.log(family);
        }
        else console.log('PERSON_NOT_FOUND');
    }

    static getRelationship(memberName,relationship) {
        let member = findFamilyMember(memberName);
        let relatives = [];
        if(member) {
            switch(relationship) {
                case "Son": if (member.children.length) {
                    for(let child of member.children) {
                        if (child.gender === 'Male') relatives.push(child.name);
                    }
                } break;
                case "Daughter": if (member.children.length) {
                    for(let child of member.children) {
                        if (child.gender === 'Female') relatives.push(child.name);
                    }
                } break;
                case "Siblings": for (let sibling of member.parent.children) {
                    if (sibling !== member) relatives.push(sibling.name);
                } break;
                case "Paternal-Uncle": if (member.parent.gender === 'Male') {
                    for(let child of member.parent.parent.children) {
                        if (child.gender === 'Male' && child !== member.parent) relatives.push(child.name);
                    }
                } break;
                case "Paternal-Aunt": if (member.parent.gender === 'Male') {
                    for(let child of member.parent.parent.children) {
                        if (child.gender === 'Female') relatives.push(child.name);
                    }
                } break;
                case "Maternal-Uncle": if (member.parent.gender === 'Female') {
                    for(let child of member.parent.parent.children) {
                        if (child.gender === 'Male') relatives.push(child.name);
                    }
                } break;
                case "Maternal-Aunt": if (member.parent.gender === 'Female') {
                    for(let child of member.parent.parent.children) {
                        if (child.gender === 'Female' && child !== member.parent) relatives.push(child.name);
                    }
                } break;
                case "Brother-In-Law": if (member.parent) {
                    for (let sibling of member.parent.children) {
                        if(sibling !== member && sibling.gender === 'Female') {
                            if(sibling.spouse) relatives.push(sibling.spouse.name);
                        }
                    }
                } else {
                    for (let sibling of member.spouse.parent.children) {
                        if(sibling !== member.spouse && sibling.gender === 'Male') relatives.push(sibling.name);
                    }
                } break;
                case "Sister-In-Law": if (member.parent) {
                    for (let sibling of member.parent.children) {
                        if(sibling !== member && sibling.gender === 'Male') {
                            if(sibling.spouse) relatives.push(sibling.spouse.name);
                        }
                    }
                } else {
                    for (let sibling of member.spouse.parent.children) {
                        if(sibling !== member.spouse && sibling.gender === 'Female') relatives.push(sibling.name);
                    }
                } break;
                default: console.log('Invalid relationship');                
            }
            relatives.length ? console.log(...relatives) : console.log('NONE');
        }
        else console.log('PERSON_NOT_FOUND');
    }
}

function findFamilyMember(name) {
    for( let member of family) {
        if (member.name === name) return member
    }
    return null;
}

console.log('----------------------- FAMILY TREE SETUP START -----------------------');

const root = new Person('Shan','Male');
family.push(root);

// Shan marries Anga
Person.addSpouse('Shan','Anga');
// Shan and Anga's Children and their spouses
Person.addChildren(root,'Anga','Chit','Male');
// Chit marries Amba
Person.addSpouse('Chit','Amba');
Person.addChildren(root,'Anga','Ish','Male');
Person.addChildren(root,'Anga','Vich','Male');
// Vich marries Lika
Person.addSpouse('Vich','Lika');
Person.addChildren(root,'Anga','Aras','Male');
// Aras marries Chitra
Person.addSpouse('Aras','Chitra');
Person.addChildren(root,'Anga','Satya','Female');
// Satya marries Vyan
Person.addSpouse('Satya','Vyan');

// Chit and Amba's children and their spouses
Person.addChildren(root,'Amba','Dritha','Female')
// Dritha marries Jaya
Person.addSpouse('Dritha','Jaya');
Person.addChildren(root,'Amba','Tritha','Female');
Person.addChildren(root,'Amba','Vritha','Male');

// Dritha and Jaya's childen
Person.addChildren(root,'Dritha','Yodhan','Male');

// Vich and Lika's children
Person.addChildren(root,'Lika','Vila','Female');
Person.addChildren(root,'Lika','Chika','Female');

// Aras and Chitra's children and their spouses
Person.addChildren(root,'Chitra','Jnki','Female');
// Jnki marries Arit
Person.addSpouse('Jnki','Arit');
Person.addChildren(root,'Chitra','Ahit','Male');

// Arit and Jnki's children
Person.addChildren(root,'Jnki','Laki','Male');
Person.addChildren(root,'Jnki','Lavnya','Female');

// Satya and Vyan's children and their spouses
Person.addChildren(root,'Satya','Asva','Male');
// Asva marries Satvy
Person.addSpouse('Asva','Satvy');
// Asva and Satvy's children
Person.addChildren(root,'Satvy','Vasa','Male');

Person.addChildren(root,'Satya','Vyas','Male');
// Vyas marries Krpi
Person.addSpouse('Vyas','Krpi');

// Vyas and Krpi's children
Person.addChildren(root,'Krpi','Kriya','Male');
Person.addChildren(root,'Krpi','Krithi','Female');

Person.addChildren(root,'Satya','Atya','Female');
console.log('----------------------- FAMILY TREE SETUP END -----------------------');

let commands = fs.readFileSync('input.txt').toString().split("\r\n");
console.log('----------------------- OUTPUT OF INPUT.TXT FILE -----------------------');
for (let command of commands) {
    let args = command.split(" ");
    if(args[0] === 'ADD_CHILD') {
        Person.addChildren(root,...args.slice(1));
    }
    else if(args[0] === 'GET_RELATIONSHIP') {
        Person.getRelationship(...args.slice(1));
    }
    else console.log("invalid command");
}
console.log('----------------------- END -----------------------');