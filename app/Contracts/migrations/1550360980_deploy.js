//const Migrations = artifacts.require("Migrations");
const GradeChain = artifacts.require("GradeChain");

module.exports = function(deployer) {
  //deployer.deploy(Migrations);
  deployer.deploy(GradeChain);
};
