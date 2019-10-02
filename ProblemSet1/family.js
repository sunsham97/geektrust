const globals = require('./globals')

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
  findChildren(member, relationship) {
    // Determining whether we are looking for sons or daughters
    let childGender = relationship === "Son" ? globals.male : globals.female;
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
  findSiblings(member) {
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
  findUncleAunt(member, relationship) {
    let relatives = [];
    let relation = relationship.split("-");
    let requiredParentGender = relation[0] === "Paternal" ? globals.male : globals.female;
    let relationGender = relation[1] === "Uncle" ? globals.male : globals.female;
    // if the parent is linked to the family tree or not
    if (member.parent) {
    // if member parent's gender and relation's gender are same
      if (member.parent.gender === requiredParentGender && 
          relationGender === member.parent.gender) {
          for (let child of member.parent.parent.children) {
            if (child.gender === relationGender && child !== member.parent)
              relatives.push(child.name);
          }
      }
      // if member parent's gender and relation's gender are oppsoite
      else if (member.parent.gender === requiredParentGender &&
               relationGender !== member.parent.gender) {
        for (let child of member.parent.parent.children) {
          if (child.gender === relationGender) relatives.push(child.name);
        }
      }
    }
    return relatives;
  }

  // method to get siblings in law of a member
  // accepts Person object and relationship("Brother-In-Law","Sister-In-Law") as arguments
  // if match found returns an array containing the names of the relatives
  // else return an empty array
  findSiblingInLaws(member, relationship) {
    let relatives = [];
    // Extracting the relation we are looking for
    let relation = relationship.split("-")[0];
    // Determining the gender of the required relation
    let relationGender = relation === "Brother" ? globals.male : globals.female;
    let oppositeGender = relationGender === globals.male ? globals.female : globals.male;
    // if member is linked with the family tree
    if (member.parent) {
      for (let sibling of member.parent.children) {
        if (sibling !== member && sibling.gender === oppositeGender && sibling.spouse)
         relatives.push(sibling.spouse.name);
      }
    } else if (member.spouse) {
      // Enters in case the member itself is not linked to the famliy but its spouse is
      if (member.spouse.parent === null) return [];  // In case both of their parents are not linked to the tree we return empty array
      
      for (let sibling of member.spouse.parent.children) {
        if (sibling !== member.spouse && sibling.gender === relationGender) relatives.push(sibling.name);
      }
    }
    // In case none of the blocks execute, an empty array is returned to show no relations found
    return relatives;
  }

  // method to add child to a member of the family tree
  // accepts Person object, mother's name, child's name, child's gender as arguments
  // if mother found, child is added succesfully, and a logger is printed
  // else corresponding logger is printed
  descend(motherName, childName, childGender) {
    let mother = this.findFamilyMember(motherName);
    // check if mother is linked to the the tree and is married
    if (mother && mother.spouse) {
      // conceive method on mother returns Person object if child added, else returns null
      let child = mother.conceive(childName, childGender);
      if (child) {
        console.log("CHILD_ADDITION_SUCCEEDED");
        this.familyMembers.push(child);
      } else console.log("CHILD_ADDITION_FAILED");
    } else console.log("PERSON_NOT_FOUND");
  }
  // method to add spouse to a member of the family tree
  // accepts member's name, spouse's name as arguments
  // if member found, spouse is added succesfully
  // else corresponding logger is printed
  marriage(memberName, spouseName) {
    let member = this.findFamilyMember(memberName);
    if (member) {
      let memberIndex = this.familyMembers.indexOf(member);
      // let spouseGender = member.gender === "Male" ? "Female" : "Male";
      // let spouse = new Person(spouseName, spouseGender);
      // member.spouse = spouse;
      // spouse.spouse = member;
      this.familyMembers.push(member.marry(spouseName));
      this.familyMembers[memberIndex] = member;
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
        // son and daughter covered with findChildren function
        case "Son":
        case "Daughter":
          relatives = this.findChildren(member, relationship);
          break;
        // siblings covered with findSiblings function
        case "Siblings":
          relatives = this.findSiblings(member);
          break;
        // Uncles and Aunts covered with findUncleAunt function
        case "Paternal-Uncle":
        case "Paternal-Aunt":
        case "Maternal-Uncle":
        case "Maternal-Aunt":
          relatives = this.findUncleAunt(member, relationship);
          break;
        case "Brother-In-Law":
        case "Sister-In-Law":
          relatives = this.findSiblingInLaws(member, relationship);
          break;
        default:
          console.log("Invalid relationship");
      }
      relatives.length ? console.log(...relatives) : console.log("NONE");
    } else console.log("PERSON_NOT_FOUND");
  }
};
