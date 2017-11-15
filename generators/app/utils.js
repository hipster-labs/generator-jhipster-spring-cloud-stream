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

const jsyaml = require('js-yaml');
const _ = require('lodash');

module.exports = {
    // array
    getPropertyInArray,
    updatePropertyInArray,
    deletePropertyInArray,
    // yaml read
    getYamlProperty,
    // yaml properties
    addYamlPropertiesAtBeginin,
    addYamlPropertiesAtEnd,
    addYamlPropertiesBeforeAnotherProperty,
    addYamlPropertiesAfterAnotherProperty,
    addYamlPropertiesAtLineIndex,
    // yaml property
    addYamlPropertyAtBeginin,
    addYamlPropertyAtEnd,
    addYamlPropertyBeforeAnotherProperty,
    addYamlPropertyAfterAnotherProperty,
    addYamlPropertyAtLineIndex,
    // test
    getLastPropertyCommonHierarchy,
    // main
    updateYamlProperties,
    updateYamlProperty
    // old functions
    // oldupdateYamlProperty,
    // oldgetYamlProperty,
    // olddeleteYamlProperty,

};

/*
 █████  ██████  ██████   █████  ██    ██     ███    ███  █████  ███    ██ ██ ██████  ██    ██ ██       █████  ████████ ███████     ██████  ██████   ██████  ██████  ███████ ██████  ████████ ██    ██
██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ████  ████ ██   ██ ████   ██ ██ ██   ██ ██    ██ ██      ██   ██    ██    ██          ██   ██ ██   ██ ██    ██ ██   ██ ██      ██   ██    ██     ██  ██
███████ ██████  ██████  ███████   ████       ██ ████ ██ ███████ ██ ██  ██ ██ ██████  ██    ██ ██      ███████    ██    █████       ██████  ██████  ██    ██ ██████  █████   ██████     ██      ████
██   ██ ██   ██ ██   ██ ██   ██    ██        ██  ██  ██ ██   ██ ██  ██ ██ ██ ██      ██    ██ ██      ██   ██    ██    ██          ██      ██   ██ ██    ██ ██      ██      ██   ██    ██       ██
██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██ ██   ██ ██   ████ ██ ██       ██████  ███████ ██   ██    ██    ███████     ██      ██   ██  ██████  ██      ███████ ██   ██    ██       ██
*/

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
    return _.get(array, name);
}

/**
 * Update or create a property by path in a array
 * TODO move to main generator ?

 * @param {array} array - array in which we want to update
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} generator - The generator
 * @param {string} value - (optional) value of the property
 */
function updatePropertyInArray(array, name, generator, value) {
    _.set(array, name, value);
}

/**
 * Delete a property by path in a array
 * TODO move to main generator ?

 * @param {array} array - array in which we want to delete
 * @param {string} name - property name to search "format myProperty.level2.level3"
 * @param {string} generator - The generator
 */
function deletePropertyInArray(array, name, generator) {
    _.unset(array, name);
}


/**
 * get common key between two array..
 * TODO To redo / optimized
 *
 * @param {string} arr1 - array to search
 * @param {string} arr2 -  array to search
 * @param {string} generator - The generator
 * @return {string} String path property
 */
function diffArray(arr1, arr2, generator) {
    let strResult;
    let result = [];
    let reduc = _.reduce(arr1, (result, value, key) => (_.isEqual(value, arr2[key]) ? result : result.concat(key)), []);

    while (reduc && reduc.length > 0) {
        result = result.concat(reduc);
        arr1 = arr1[reduc[0]];
        arr2 = arr2[reduc[0]];
        if (arr1 === undefined || arr2 === undefined) {
            return undefined;
        }
        reduc = reduceYaml(arr1, arr2, result);
    }

    if (result !== undefined) {
        strResult = result.join('.');
    }
    return strResult;
}

/**
 * use by diffArray
 * TODO To redo / optimized
 *
 * @param {string} arr1 - array to search
 * @param {string} arr2 -  array to search
 * @param {string} result -
 * @return {string} String path property
 */
function reduceYaml(arr1, arr2, result) {
    return _.reduce(arr1, (result, value, key) => {
        if (arr2[key]) {
            return _.isEqual(value, arr2[key]) ? result : result.concat(key);
        }
        return false;
    }, []);
}
/*
██    ██  █████  ███    ███ ██          ███████ ██ ██      ███████     ██████  ███████  █████  ██████
 ██  ██  ██   ██ ████  ████ ██          ██      ██ ██      ██          ██   ██ ██      ██   ██ ██   ██
  ████   ███████ ██ ████ ██ ██          █████   ██ ██      █████       ██████  █████   ███████ ██   ██
   ██    ██   ██ ██  ██  ██ ██          ██      ██ ██      ██          ██   ██ ██      ██   ██ ██   ██
   ██    ██   ██ ██      ██ ███████     ██      ██ ███████ ███████     ██   ██ ███████ ██   ██ ██████
*/


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
    const treeData = jsyaml.safeLoad(generator.fs.readFileSync(`${file}`, 'utf8'));
    return getPropertyInArray(treeData, name.toString().split('.'), generator);
}

/*
██    ██  █████  ███    ███ ██          ███████ ██ ██      ███████     ███    ███  █████  ███    ██ ██ ██████  ██    ██ ██       █████  ████████ ███████     ██████  ██████   ██████  ██████  ███████ ██████  ████████ ██ ███████ ███████
 ██  ██  ██   ██ ████  ████ ██          ██      ██ ██      ██          ████  ████ ██   ██ ████   ██ ██ ██   ██ ██    ██ ██      ██   ██    ██    ██          ██   ██ ██   ██ ██    ██ ██   ██ ██      ██   ██    ██    ██ ██      ██
  ████   ███████ ██ ████ ██ ██          █████   ██ ██      █████       ██ ████ ██ ███████ ██ ██  ██ ██ ██████  ██    ██ ██      ███████    ██    █████       ██████  ██████  ██    ██ ██████  █████   ██████     ██    ██ █████   ███████
   ██    ██   ██ ██  ██  ██ ██          ██      ██ ██      ██          ██  ██  ██ ██   ██ ██  ██ ██ ██ ██      ██    ██ ██      ██   ██    ██    ██          ██      ██   ██ ██    ██ ██      ██      ██   ██    ██    ██ ██           ██
   ██    ██   ██ ██      ██ ███████     ██      ██ ███████ ███████     ██      ██ ██   ██ ██   ████ ██ ██       ██████  ███████ ██   ██    ██    ███████     ██      ██   ██  ██████  ██      ███████ ██   ██    ██    ██ ███████ ███████
*/

/**
 * Add yaml properties at beginin
 *
 * @param {string} file - yaml file to update
 * @param {array} properties - array of property to add
 * @param {string} generator - The generator
 */
function addYamlPropertiesAtBeginin(file, properties, generator) {
    const bodyLines = generator.fs.readFileSync(`${file}`, 'utf8').split('\n');
    const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
    bodyLines.splice(bodyLines.count, 0, newLines.join('\n'));
    generator.fs.writeFileSync(`${file}`, bodyLines.join('\n'), 'utf8');
}

/**
 * Add yaml properties at end
 *
 * @param {string} file - yaml file to update
 * @param {array} properties - array of property to add
 * @param {string} generator - The generator
 */
function addYamlPropertiesAtEnd(file, properties, generator) {
    const bodyLines = generator.fs.readFileSync(`${file}`, 'utf8').split('\n');
    const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
    generator.fs.writeFileSync(`${file}`, bodyLines.concat(newLines).join('\n'), 'utf8');
}

/**
 * Add yaml properties before another property
 *
 * @param {string} file - yaml file to update
 * @param {array} properties - array of property to add
 * @param {string} generator - The generator
 * @param {string} propertyBefore - The property before which we wish to insert new properties
 * @param {string} addBeforeComment - (Optional) if this variable is defined, means that we will return the index before the previuous comment of the property.
 */
function addYamlPropertiesBeforeAnotherProperty(file, properties, generator, propertyBefore, addBeforeComment) {
    const body = generator.fs.readFileSync(`${file}`, 'utf8');
    const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
    const applicationPropertyIndex = getIndexBeforeLineOfProperty(body, propertyBefore, generator, addBeforeComment);
    if (applicationPropertyIndex === -1) {
        throw new Error(`Property ${propertyBefore} not found`); // inside callback
    }
    const bodyLines = body.split('\n');
    bodyLines.splice(applicationPropertyIndex, 0, newLines.join('\n'));
    generator.fs.writeFileSync(`${file}`, bodyLines.join('\n'), 'utf8');
}

/**
 * Add yaml properties after another property
 *
 * @param {string} file - yaml file to update
 * @param {array} properties - array of property to add
 * @param {string} generator - The generator
 * @param {string} propertyAfter - The property after which we wish to insert new properties
 */
function addYamlPropertiesAfterAnotherProperty(file, properties, generator, propertyAfter) {
    const body = generator.fs.readFileSync(`${file}`, 'utf8');
    const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
    const applicationPropertyIndex = getIndexAfterLineOfProperty(body, propertyAfter, generator);
    if (applicationPropertyIndex === -1) {
        throw new Error(`Property ${propertyAfter} not found`); // inside callback
    }
    const bodyLines = body.split('\n');
    bodyLines.splice(applicationPropertyIndex, 0, newLines.join('\n'));
    generator.fs.writeFileSync(`${file}`, bodyLines.join('\n'), 'utf8');
}

/**
 * Add yaml properties at a specific line
 *
 * @param {string} file - yaml file to update
 * @param {array} properties - array of property to add
 * @param {string} generator - The generator
 * @param {string} indexLine - Index of line which we wish to insert new properties
 * @param {string} numberSpace - number espace to start
 */
function addYamlPropertiesAtLineIndex(file, properties, generator, indexLine, numberSpace) {
    const body = generator.fs.readFileSync(`${file}`, 'utf8');
    const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
    const bodyLines = body.split('\n');
    let spaceStr = '';
    for (let i = 0; i < numberSpace; i++) {
        spaceStr += ' ';
    }
    bodyLines.splice(indexLine, 0, newLines.map(line => spaceStr + line).join('\n'));
    generator.fs.writeFileSync(`${file}`, bodyLines.join('\n'), 'utf8');
}
/*
██    ██  █████  ███    ███ ██          ███████ ██ ██      ███████     ███    ███  █████  ███    ██ ██ ██████  ██    ██ ██       █████  ████████ ███████     ██████  ██████   ██████  ██████  ███████ ██████  ████████ ██    ██
 ██  ██  ██   ██ ████  ████ ██          ██      ██ ██      ██          ████  ████ ██   ██ ████   ██ ██ ██   ██ ██    ██ ██      ██   ██    ██    ██          ██   ██ ██   ██ ██    ██ ██   ██ ██      ██   ██    ██     ██  ██
  ████   ███████ ██ ████ ██ ██          █████   ██ ██      █████       ██ ████ ██ ███████ ██ ██  ██ ██ ██████  ██    ██ ██      ███████    ██    █████       ██████  ██████  ██    ██ ██████  █████   ██████     ██      ████
   ██    ██   ██ ██  ██  ██ ██          ██      ██ ██      ██          ██  ██  ██ ██   ██ ██  ██ ██ ██ ██      ██    ██ ██      ██   ██    ██    ██          ██      ██   ██ ██    ██ ██      ██      ██   ██    ██       ██
   ██    ██   ██ ██      ██ ███████     ██      ██ ███████ ███████     ██      ██ ██   ██ ██   ████ ██ ██       ██████  ███████ ██   ██    ██    ███████     ██      ██   ██  ██████  ██      ███████ ██   ██    ██       ██
*/

/**
 * Add a yaml property at beginin
 * TODO manage value of array type
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name format spring.cloud.name
 * @param {string | integer } value - value of the property
 * @param {string} generator - The generator
 */
function addYamlPropertyAtBeginin(file, property, value, generator) {
    const properties = {};
    updatePropertyInArray(properties, property, generator, value);
    addYamlPropertiesAtBeginin(file, properties, generator);
}

/**
 * Add a yaml property at end
 * TODO manage value of array type
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name
 * @param {string | integer } value - value of the property
 * @param {string} generator - The generator
 */
function addYamlPropertyAtEnd(file, property, value, generator) {
    const properties = {};
    updatePropertyInArray(properties, property, generator, value);
    addYamlPropertiesAtEnd(file, properties, generator);
}

/**
 * Add a yaml property before another property
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name
 * @param {string} value - value of property
 * @param {string} generator - The generator
 * @param {string} propertyBefore - The property before which we wish to insert new property
 * @param {string} addBeforeComment - (Optional) if this variable is defined, means that we will return the index before the previuous comment of the property.
 */
function addYamlPropertyBeforeAnotherProperty(file, property, value, generator, propertyBefore, addBeforeComment) {
    const properties = {};
    updatePropertyInArray(properties, property, generator, value);
    addYamlPropertiesBeforeAnotherProperty(file, properties, generator, propertyBefore, addBeforeComment);
}

/**
 * Add a yaml property after another property
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name
 * @param {string} value - value of property
 * @param {string} generator - The generator
 * @param {string} propertyAfter - The property before which we wish to insert new property
 */
function addYamlPropertyAfterAnotherProperty(file, property, value, generator, propertyAfter) {
    const properties = {};
    updatePropertyInArray(properties, property, generator, value);
    addYamlPropertiesAfterAnotherProperty(file, properties, generator, propertyAfter);
}

/**
 * Add yaml properties at a specific line
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name
 * @param {string} value - value of property
 * @param {string} generator - The generator
 * @param {string} indexLine - Index of line which we wish to insert new properties
 * @param {string} numberSpace - number espace to start
 */
function addYamlPropertyAtLineIndex(file, property, value, generator, indexLine, numberSpace) {
    const properties = {};
    updatePropertyInArray(properties, property, generator, value);
    addYamlPropertiesAtLineIndex(file, properties, generator, indexLine, numberSpace);
}
/*
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
*/

/**
 * Get the last property of a common hierarchical.
 *
 * @param {string} body - String body to search
 * @param {string} property - property name to remove
 * @param {string} generator - The generator
  * @return {string} String path property
 */
function getLastPropertyCommonHierarchy(body, property, generator) {
    try {
        const hierProperty = {};
        _.set(hierProperty, property, null);
        const arr = jsyaml.safeLoad(body);
        return diffArray(hierProperty, arr, generator);
    } catch (e) {
        generator.log(e);
        return undefined;
    }
}
/**
 * Get the last propertie of a common hierarchical.
 *
 * @param {string} body - String body to search
 * @param {array} properties - property name to remove
 * @param {string} generator - The generator
  * @return {string} String path property
 */
function getLastPropertiesCommonHierarchy(body, properties, generator) {
    try {
        const arr = jsyaml.safeLoad(body);
        return diffArray(properties, arr, generator);
    } catch (e) {
        generator.log(e);
        return undefined;
    }
}

/**
 * Retourne l'index de la ligne d'une propriété simple et unique
 *
 * @param {string} body - String body to search
 * @param {string} property - property name to search
 * @param {string} generator - The generator
 * @param {boolean} addBeforeComment - if this variable is true, means that we will return the index before the previuous comment of the property.
 */
function getIndexBeforeLineOfProperty(body, property, generator, addBeforeComment) {
    try {
        const lines = body.split('\n');

        let otherwiseLineIndex = -1;
        lines.some((line, i) => {
            if ((line.indexOf('#') === -1) && (line.indexOf(`${property}:`) !== -1)) {
                otherwiseLineIndex = i;
                return true;
            }
            return false;
        });

        if (addBeforeComment === true) {
            for (let i = otherwiseLineIndex - 1; i > 0; i--) {
                if (lines[i].indexOf('#') !== -1 || (/^\s*$/.test(lines[i]))) {
                    otherwiseLineIndex = i;
                } else {
                    break;
                }
            }
            otherwiseLineIndex += 1;
        }
        return otherwiseLineIndex;
    } catch (e) {
        generator.log(e);
        return -1;
    }
}

/**
 * Array of line of yaml file has a property ?
 *
 * @param {array} array - String body to search
 * @param {string} property - property name to search
* @param {int} fromIdx - start search from
 * @param {string} generator - The generator
 */
function hasProperty(array, property, fromIdx, generator) {
    let returnIndex = -1;
    if (fromIdx === -1) {
        fromIdx = 0;
    }
    for (let i = fromIdx; i < array.length; i++) {
        const line = array[i];

        if ((line.indexOf(`${property}:`) !== -1) &&
            ((line.indexOf('#') === -1) || ((line.indexOf('#') !== -1) && (line.indexOf('#') > line.indexOf(`${property}:`))))
        ) {
            // generator.log(`line ${line}`);
            returnIndex = i;
            break;
        }
    }
    return returnIndex;
}

/**
 * get index of line of property
 *
 * @param {string} body - String body to search
 * @param {string} property - property name to search
 * @param {string} generator - The generator
  * @param {string} ignorecur - (Optional) If define, return the index at the end all the properties child of the property.
  * If not define, return the index at the end all the properties of the parent property.
 */
function getIndexAfterLineOfProperty(body, property, generator, ignorecur) {
    const lines = body.split('\n');
    // generator.log('property : ' + property);
    let otherwiseLineIndex = -1;
    let curr;

    const namePath = property.split('.');
    // generator.log('namePath : ' + namePath);

    curr = namePath.splice(0, 1);

    while (curr !== undefined) {
        //  generator.log(`Property name cur : ${curr}`);
        otherwiseLineIndex = hasProperty(lines, curr, otherwiseLineIndex, generator);
        // generator.log(`index line : ${otherwiseLineIndex}`);
        // generator.log(`cur props : ${curr}`);
        curr = namePath.splice(0, 1)[0];
    }


    if (otherwiseLineIndex === -1) {
        return otherwiseLineIndex;
    }
    if (ignorecur) {
        otherwiseLineIndex += 1;
    }

    let spaces = 0;
    // generator.log(`otherwiseLineIndex : ${otherwiseLineIndex}`);
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
        spaces += 1;
    }
    // generator.log(`space number : ${spaces}`);
    let spacesNext = 0;
    for (let i = otherwiseLineIndex + 1; i < lines.length; i++) {
        //  generator.log(`next line : ${lines[i]}`);
        // line  by comments
        if (lines[i].trim().indexOf('#') !== 0) {
            spacesNext = 0;
            while (lines[i].charAt(spacesNext) === ' ') {
                spacesNext += 1;
            }
            // generator.log(`spaces: ${spaces}`);
            // generator.log(`spacesNext: ${spacesNext}`);
            // if next line has same number of space or more than the property, then it's a new property
            if (spacesNext >= spaces && spacesNext !== 0) {
                otherwiseLineIndex = i;
                //  generator.log(`idx: ${otherwiseLineIndex}`);
            } else {
                break;
            }
        }
    }

    return otherwiseLineIndex + 1;
}


/*
███    ███  █████  ██ ███    ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
████  ████ ██   ██ ██ ████   ██     ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
██ ████ ██ ███████ ██ ██ ██  ██     █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
██  ██  ██ ██   ██ ██ ██  ██ ██     ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
██      ██ ██   ██ ██ ██   ████     ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
*/


/**
 * Rewrite a yaml file.
 * TODO move to main generator ?
 * TODO manage value of array type
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name format spring.cloud.name
 * @param {string | integer } value - value of the property
 * @param {string} generator - The generator
 * @param {string} name - property name to remove
 */
function updateYamlProperty(file, property, value, generator) {
    try {
        const properties = {};
        updatePropertyInArray(properties, property, generator, value);
        updateYamlProperties(file, properties, generator);
    } catch (e) {
        generator.log(e);
    }
}

/**
 * Rewrite a yaml file.
 * TODO move to main generator ?
 * TODO manage case where properties have different parents
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name format spring.cloud.name
 * @param {string | integer } value - value of the property
 * @param {string} generator - The generator
 * @param {string} name - property name to remove
 */
function updateYamlProperties(file, properties, generator) {
    try {
        let propertyParentFound = false;

        const body = generator.fs.readFileSync(`${file}`, 'utf8');
        //  generator.log(` properties : ${properties}`);
        const propExist = getLastPropertiesCommonHierarchy(body, properties, generator);

        if (propExist !== undefined) {
            propertyParentFound = true;
            // generator.log(`Property commune ${propExist} FOUND\n`);
            const arrPropExist = propExist.split('.');
            const spaces = arrPropExist.length * 4;
            //  generator.log(`space ${spaces}`);

            const indexLineProps = getIndexAfterLineOfProperty(body, propExist, generator, true);
            //  generator.log(`line index ${indexLineProps}`);

            let removeArray = properties;
            for (let i = 0; i < arrPropExist.length; i++) {
                removeArray = removeArray[arrPropExist[i]];
            }
            // generator.log(`removeArray ${removeArray}`);

            addYamlPropertiesAtLineIndex(file, removeArray, generator, indexLineProps, spaces);
        }
        if (propertyParentFound === false) {
            // generator.log('Property Parent not FOUND\n');
            addYamlPropertiesAtEnd(file, properties, generator);
            return;
        }
        // getLastPropertyCommonHierarchy(body, property, generator);
    } catch (e) {
        generator.log(e);
    }
}
