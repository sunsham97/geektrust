module.exports = class Person {
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
    
}