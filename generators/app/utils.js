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
    updateYamlProperty,
    getYamlProperty,
    deleteYamlProperty
};

/**
 * get a property by path in a array
 * TODO move to main generator ?
 *
 * @param {array} array - array in which we want to search
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} generator - The generator
 * @return {string} the value of property or undefined
 */
function getPropertyInArray(array, name, generator) {
    try {
        return _.get(array, name);
    } catch (e) {
        generator.log(e);
        return undefined;
    }
}

/**
 * Update or create a property by path in a array
 * TODO move to main generator ?

 * @param {array} array - array in which we want to search
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} generator - The generator
 * @param {string} value - (optional) value of the property
 */
function updatePropertyInArray(array, name, generator, value) {
    try {
        _.set(array, name, value);
    } catch (e) {
        generator.log(e);
    }
}

/**
 * Delete a property by path in a array
 * TODO move to main generator ?

 * @param {array} array - array in which we want to search
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} generator - The generator
 */
function deletePropertyInArray(array, name, generator) {
    try {
        _.unset(array, name);
    } catch (e) {
        generator.log(e);
    }
}

/**
 * Get a yaml property by path in a file
 * TODO move to main generator ?
 *
 * @param {string} file - yaml file to search
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} generator - The generator
 * @return {string} the value of property or undefined
 */
function getYamlProperty(file, name, generator) {
    try {
        const treeData = jsyaml.safeLoad(generator.fs.read(`${file}`));
        return getPropertyInArray(treeData, name.toString().split('.'), generator);
    } catch (e) {
        generator.log(e);
        return undefined;
    }
}

/**
 * Ad or update a property  by path.
 * TODO move to main generator ?
 *
 * @param {string} file - yaml file to update
 * @param {string} generator - The generator
 * @param {string} name - property name to add
 * @param {string} value - (optional) value of the property
 */
function updateYamlProperty(file, generator, name, value) {
    try {
        const treeData = jsyaml.safeLoad(generator.fs.read(`${file}`));
        updatePropertyInArray(treeData, name, generator, value);
        rewriteYamlFile(file, treeData, generator);
        // generator.log(treeData["jhipster"]);
    } catch (e) {
        generator.log(e);
        generator.log(`${chalk.yellow('\nError ') + chalk.yellow('. Reference to ')}addYamlProperty(file: ${file}, generator:${generator}, name:${name}, value:${value}\n'`);
        generator.debug('Error:', e);
    }
}

/**
 * Delete a yaml property.
 * TODO move to main generator ?
 *
 * @param {string} file - yaml file to update
 * @param {string} generator - The generator
 * @param {string} name - property name to remove
 */
function deleteYamlProperty(file, generator, name) {
    try {
        const treeData = jsyaml.safeLoad(generator.fs.read(`${file}`));
        deletePropertyInArray(treeData, name, generator);
        rewriteYamlFile(file, treeData, generator);
        // generator.log(getPropertyInArray(treeData, name, generator));
    } catch (e) {
        generator.log(e);
        generator.log(`${chalk.yellow('\nError ') + chalk.yellow('. Reference to ')}deleteYamlProperty(file: ${file}, generator:${generator}, name:${name}\n'`);
        generator.debug('Error:', e);
    }
}

/**
 * Rewrite a yaml file.
 * TODO move to main generator ?
 *
 * @param {string} file - yaml file to update
 * @param {string} generator - The generator
 * @param {string} name - property name to remove
 */
function rewriteYamlFile(file, data, generator) {
    try {
        // const origData = jsyaml.safeLoad(generator.fs.read(`${file}`));
        const dump = jsyaml.safeDump(data, {
            'indent': 4
        });
        generator.fs.write(file, dump);
    } catch (e) {
        generator.log(e);
        generator.log(`${chalk.yellow('\nError ') + chalk.yellow('. Reference to ')}deleteYamlProperty(file: ${file}, generator:${generator}, data:${data}\n'`);
        generator.debug('Error:', e);
    }
}
