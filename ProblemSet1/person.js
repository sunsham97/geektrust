const globals = require('./globals');
module.exports = class Person {
  // class variables
  // below declarations work in the latest node version
  // name = '';
  // gender = '';
  // spouse =  null;
  // parent = null;
  // children = [];

  // class methods
  constructor(name, gender, parent = null) {
    this.name = name;
    this.gender = gender;
    this.parent = parent;
    this.spouse = null;
    this.children = [];
  }

  marry(spouseName) {
    let spouseGender = this.gender === globals.male ? globals.female : globals.male;
    this.spouse = new Person(spouseName, spouseGender);
    this.spouse.spouse = this;
    return this.spouse;
  }

  conceive(childName, childGender) {
    if(this.gender === globals.female && this.spouse) {
        let child = new Person(childName,childGender);
        child.parent = this.parent ? this : this.spouse;
        this.children.push(child);
        this.spouse.children = this.children;
        return child;
    }
    else return null;
  }
};
