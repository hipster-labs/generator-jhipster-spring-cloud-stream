/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chalk = require('chalk');
const jsyaml = require('js-yaml');
const _ = require('lodash');

module.exports = {
    addYamlProperty,
    findYamlProperty

};
// function createNode(name) {
//     return({name: name, children: []});
// }
//
// function addChild(node, child) {
//     node.children.push(child);
//     return node;
// }

// function findYamlPropertyByPath(root, path) {
//     var curr;
//     while (root && ((curr = path.splice(0, 1)[0]) !== undefined)) {
//         if (root.children)
//             root = root.children[curr];
//         else
//             root = undefined;
//     }
//     return root;
// }

/**
 * Search a property in a multidimensional Array hierarchical.
 * Example : findPropertyByNameInMultiDimensonalHierarchicalArray(treeData, ["lvl2", "lvl2", "lvl3"]);
 * @param {string} root - array where you want to searc
 * @param {string} namePath - path in array format
 * @param {string} updateValue - (optional) Value to update
 */
function findPropertyByNameInMultiDimensonalHierarchicalArray(root, namePath, updateValue) {
        var curr;
        var origin=root;
        //console.log(root);
        while (root && ((curr = namePath.splice(0, 1)[0]) !== undefined)) {
            //   console.log(curr);
            if (root[curr]) {
                root = root[curr];
            } else {
                root = undefined;
            }
        }
        if (updateValue){
            root[curr]=updateValue;
        }
        return root;
}


/**
 * Find a yaml property by path in a file
 * TODO move to main generator ?
 *
 * @param {string} file - yaml file to search
 * @param {string} generator - The generator
 * @param {string} name - property name to search "format myPropety.level2.level3"
 * @return {string} the value of property or undefined
 */
function findYamlProperty(file, generator, name) {
    try {
        const treeData = jsyaml.load(generator.fs.read(`${file}`));
        return findPropertyByNameInMultiDimensonalHierarchicalArray(treeData, name.toString().split("."));
    } catch (e) {
        generator.log(e);
    }

}

// /**
//  * Find a property by path in a array
//  * TODO move to main generator ?
//  *
//  * @param {array} file -array in which we want to search
//  * @param {string} generator - The generator
//  * @param {string} name - property name to search "format myPropety.level2.level3"
//  * @return {string} the value of property or undefined
//  */
// function findPropertyInArray(array, generator, name) {
//     try {
//         return findPropertyByNameInMultiDimensonalHierarchicalArray(array, name.toString().split("."));
//     } catch (e) {
//         generator.log(e);
//     }
//
// }
function fetchFromObject(obj, prop){
    //property not found
    if(typeof obj === 'undefined') return false;

    //index of next property split
    var _index = prop.indexOf('.')

    //property split found; recursive call
    if(_index > -1){
        //get object at property (before split), pass on remainder
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index+1));
    }

    //no split; get property
    return obj[prop];
}

/**
 * get a property by path in a array
 * TODO move to main generator ?
 *
 * @param {array} file -array in which we want to search
 * @param {string} generator - The generator
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @return {string} the value of property or undefined
 */
function getPropertyInArray(array, generator, name) {
    try {
        return _.get(array, name);
    } catch (e) {
        generator.log(e);
    }

}

/**
 * Find a property by path in a array
 * TODO move to main generator ?
 *
 * @param {array} file -array in which we want to search
 * @param {string} generator - The generator
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} value - (optional) value of the property
 */
function addPropertyInArray(treeData, name, value) {
    try {
        _.set(treeData, name, value);
    } catch (e) {
        generator.log(e);
    }
}

/**
 * Add a new yaml property.
 * TODO move to main generator ?
 *
 * @param {string} file - yaml file to update
 * @param {string} generator - The generator
 * @param {string} name - property name to add
 * @param {string} value - (optional) value of the property
 */
function addYamlProperty(file, generator, name, value) {
    try {
        var treeData = jsyaml.load(generator.fs.read(`${file}`));

//generator.log(_.get(treeData, name));
addPropertyInArray(treeData, name, value);

//generator.log(fetchFromObject(treeData, name));
//        generator.log(`${treeData}.${name}`);
//        var treeData = createNode("");
//        var subChild = createNode("");
//        addChild(subChild, createNode("A31"));
//        addChild(treeData, subChild);
    //generator.log(treeData["jhipster"]);

    //    var A31 = findNodeByPath(treeData, [0, 0]); // Will return the node with name A31
        //  generator.log(A31);

        //var property = findYamlProperty(file, generator, name);
    //     var property = findPropertyInArray(treeData, generator, name);
    //         generator.log(property);
    //
    //     var property2 =  findPropertyByNameInMultiDimensonalHierarchicalArray(treeData, name.toString().split("."), 1000);
    //     generator.log(property2);
     generator.log(treeData["jhipster"]);

        // generator.log(yaml);
//        const hierarchyProperty = name.toString().split(".");
//        let property;
//        hierarchyProperty.forEach(function(entry) {
//            property = entry;
//            generator.log(entry + '\n')
//        });

//        const yamlConfig = yaml[property];
//        generator.log(yamlConfig);
        //generator.log("property exist : " + hierarchyProperty.hasOwnProperty('test'));



    } catch (e) {
        generator.log(e);
        generator.log(`${chalk.yellow('\nError ') + chalk.yellow('. Reference to ')}addYamlProperty(file: ${file}, generator:${generator}, name:${name}, value:${value}\n'`);
        generator.debug('Error:', e);
    }
}
