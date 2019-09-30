// Person class import
const Person = require("./person");
// FamilyTree class implementation
module.exports = class FamilyTree {
  constructor() {
    this.familyMembers = [];
  }
// method to find whether a member with the given name exists in the family tree
// accepts name(string) as an argument
// if match found: returns the object of Person type
// else return null
  findFamilyMember(name) {
    for (let member of this.familyMembers) {
      if (member.name === name) return member;
    }
    return null;
  }
// method to get children of a member
// accepts Person object and relationship(either "Son" or "Daughter") as arguments
// if match found returns an array containing the names of the children
// else return an empty array
  getChildren(member, relationship) {
    // Determining whether we are looking for sons or daughters
    let childGender = relationship === "Son" ? "Male" : "Female";
    let children = [];
    // To check whether the member has children or not
    if (member.children.length) {
      for (let child of member.children) {
        if (child.gender === childGender) children.push(child.name);
      }
    }
    return children;
  }

// method to get siblings of a member
// accepts Person object as argument
// if match found returns an array containing the names of the children
// else return an empty array
  getSiblings(member) {
    let siblings = [];
    // To check whether parent of the member is linked to the family tree or not.
    //  "null" means not linked
    if (member.parent) {
      for (let sibling of member.parent.children) {
        if (sibling !== member) siblings.push(sibling.name);
      }
    }
    return siblings;
  }

// method to get uncles and aunts(paternal or maternal) of a member
// accepts Person object and relationship("Paternal-Uncle","Paternal-Aunt","Maternal-Uncle","Maternal-Aunt") as arguments
// if match found returns an array containing the names of the relatives
// else return an empty array
  getUncleAunt(member, relationship) {
    let relatives = [];
    let relation = relationship.split("-");
    let requiredParentGender = relation[0] === "Paternal" ? "Male" : "Female";
    let relationGender = relation[1] === "Uncle" ? "Male" : "Female";
    // checks if the parent is linked to the family tree or not
    if (member.parent) {
      // To check if parent linked to the relation is linked to family or not
      if (member.parent.gender === requiredParentGender) {
        // if member parent's gender and relation's gender are same
        // say we are looking for maternal-aunt of a member
        // whose parent linked to the family tree is female i.e. mother
        if (relationGender === member.parent.gender) {
          for (let child of member.parent.parent.children) {
            if (child.gender === relationGender && child !== member.parent)
              relatives.push(child.name);
          }
        }
        // if member parent's gender and relation's gender are oppsoite
        // say we are looking for paternal-aunt of a member
        // whose parent linked to the family tree is male i.e. father
        else {
          for (let child of member.parent.parent.children) {
            if (child.gender === relationGender) relatives.push(child.name);
          }
        }
      }
    }
    return relatives;
  }

// method to get siblings in law of a member
// accepts Person object and relationship("Brother-In-Law","Sister-In-Law") as arguments
// if match found returns an array containing the names of the relatives
// else return an empty array
  getSiblingInLaws(member, relationship) {
    let relatives = [];
    // Extracting the relation we are looking for
    let relation = relationship.split("-")[0];
    // Determining the gender of the required relation
    let relationGender = relation === "Brother" ? "Male" : "Female";
    // Determining opposite gender of the required relation
    let oppositeGender = relationGender === "Male" ? "Female" : "Male";
    // if member is linked with the family tree
    if (member.parent) {
      // we iterate over the children of member's parent
      for (let sibling of member.parent.children) {
        // checks if the sibling is not the member itself and the gender of the sibling is its opposite
        if (sibling !== member && sibling.gender === oppositeGender) {
          // if sibling's spouse exists we push it to the answer array
          if (sibling.spouse) relatives.push(sibling.spouse.name);
        }
      }
    } else if (member.spouse) {
      // Enters in case the member itself is not linked to the famliy but its spouse is

      // In case both of their parents are not linked to the tree we return empty array
      // Eg: Shan and Anga
      if (member.spouse.parent === null) return [];
      // Since member's spouse is linked to the family, we iterate over
      // the siblings of the member's spouse
      for (let sibling of member.spouse.parent.children) {
        // if its not the spouse and the gender of the sibling matches the gender of the required relation
        if (sibling !== member.spouse && sibling.gender === relationGender)
          relatives.push(sibling.name);
      }
    }
    // In case none of the blocks execute, an empty array is returned to show no relations found
    return relatives;
  }

// method to add child to a member of the family tree
// accepts Person object, mother's name, child's name, child's gender as arguments
// if mother found, child is added succesfully, and a logger is printed
// else corresponding logger is printed
  addChildren(root, motherName, childName, childGender) {
    let mother = this.findFamilyMember(motherName);
    // to check if name of member entered is of a married female 
    if (mother && mother.gender === "Female" && mother.spouse) {
    // to check mother is either the root or its spouse
      if (
        (root.gender === "Female" && root.name === motherName && root.spouse) ||
        (root.gender === "Male" &&
          root.spouse &&
          root.spouse.name === motherName)
      ) {
        console.log("CHILD_ADDITION_SUCCEEDED");
        this.familyMembers.push(new Person(childName, childGender, root));
        root.children.push(this.familyMembers[this.familyMembers.length - 1]);
        root.spouse.children = root.children;
        return true;
      } else if (root.spouse && root.children.length) {
        // enters if root has children
        for (let child of root.children) {
          // console.log(`${child.name}'s tree`)
          let result = this.addChildren(
            child,
            motherName,
            childName,
            childGender
          );
          if (result) return true;
        }
      } else {
        // console.log(`not found in ${root.name}'s tree`);
        return false;
      }
    } else {
    // In case mother is not found in the family tree
      if (!mother) console.log("PERSON_NOT_FOUND");
    // In case gender of the member was found to male
      else console.log("CHILD_ADDITION_FAILED");
      return;
    }
  }
// method to add spouse to a member of the family tree
// accepts member's name, spouse's name as arguments
// if member found, spouse is added succesfully
// else corresponding logger is printed
  addSpouse(memberName, spouseName) {
    let member = this.findFamilyMember(memberName);
    if (member) {
      let memberIndex = this.familyMembers.indexOf(member);
      let spouseGender = member.gender === "Male" ? "Female" : "Male";
      let spouse = new Person(spouseName, spouseGender);
      member.spouse = spouse;
      spouse.spouse = member;
      this.familyMembers[memberIndex] = member;
      this.familyMembers.push(spouse);
      // console.log(family);
    } else console.log("PERSON_NOT_FOUND");
  }
// method to get relatives of a member of the family tree
// accepts member's name, relationship type as arguments
// if match found, names of the relatives printed
// else corresponding logger is printed
  getRelationship(memberName, relationship) {
    let member = this.findFamilyMember(memberName);
    let relatives = [];
    if (member) {
      switch (relationship) {
        // son and daughter covered with getChildren function
        case "Son":
        case "Daughter":
          relatives = this.getChildren(member, relationship);
          break;
        // siblings covered with getSiblings function
        case "Siblings":
          relatives = this.getSiblings(member);
          break;
        // Uncles and Aunts covered with getUncleAunt function
        case "Paternal-Uncle":
        case "Paternal-Aunt":
        case "Maternal-Uncle":
        case "Maternal-Aunt":
          relatives = this.getUncleAunt(member, relationship);
          break;
        case "Brother-In-Law":
        case "Sister-In-Law":
          relatives = this.getSiblingInLaws(member, relationship);
          break;
        default:
          console.log("Invalid relationship");
      }
      relatives.length ? console.log(...relatives) : console.log("NONE");
    } else console.log("PERSON_NOT_FOUND");
  }
};
