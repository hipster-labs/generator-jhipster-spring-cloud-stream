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

 * @param {array} array - array in which we want to update
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

 * @param {array} array - array in which we want to delete
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
 * get common key between two array..
 * TODO To redo / optimized
 *
 * @param {string} arr1 - array to search
 * @param {string} arr2 -  array to search
 * @param {string} generator - The generator
 * @return {string} String path property
 */
function diffArray(arr1, arr2, generator) {
    try {
        let strResult;
        let result = [];
        let reduc = _.reduce(arr1, function (result, value, key) {
            return _.isEqual(value, arr2[key]) ? result : result.concat(key);
        }, []);

        while (reduc && reduc.length > 0) {
            result = result.concat(reduc);
            arr1 = arr1[reduc[0]];
            arr2 = arr2[reduc[0]];
            if (arr1 === undefined || arr2 === undefined) {
                return undefined;
            }
            reduc = _.reduce(arr1, function (result, value, key) {
                if (arr2[key]) {
                    return _.isEqual(value, arr2[key]) ? result : result.concat(key);
                }
                return false;
            }, []);
        }

        if (result !== undefined) {
            strResult = result.join('.');
        }
        return strResult;
    } catch (e) {
        generator.log(e);
        return undefined;
    }
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
    try {
        const treeData = jsyaml.safeLoad(generator.fs.read(`${file}`));
        return getPropertyInArray(treeData, name.toString().split('.'), generator);
    } catch (e) {
        generator.log(e);
        return undefined;
    }
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
    try {
        const bodyLines = generator.fs.read(file).split('\n');
        const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
        bodyLines.splice(bodyLines.count, 0, newLines.join('\n'));
        generator.fs.write(file, bodyLines.join('\n'));
    } catch (e) {
        generator.log(e);
    }
}

/**
 * Add yaml properties at end
 *
 * @param {string} file - yaml file to update
 * @param {array} properties - array of property to add
 * @param {string} generator - The generator
 */
function addYamlPropertiesAtEnd(file, properties, generator) {
    try {
        const bodyLines = generator.fs.read(file).split('\n');
        const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
        generator.fs.write(file, bodyLines.concat(newLines).join('\n'));
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const body = generator.fs.read(file);
        const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
        const applicationPropertyIndex = getIndexBeforeLineOfProperty(body, propertyBefore, generator, addBeforeComment);
        const bodyLines = body.split('\n');
        bodyLines.splice(applicationPropertyIndex, 0, newLines.join('\n'));
        generator.fs.write(file, bodyLines.join('\n'));
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const body = generator.fs.read(file);
        const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
        const applicationPropertyIndex = getIndexAfterLineOfProperty(body, propertyAfter, generator);
        const bodyLines = body.split('\n');
        bodyLines.splice(applicationPropertyIndex, 0, newLines.join('\n'));
        generator.fs.write(file, bodyLines.join('\n'));
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const body = generator.fs.read(file);
        const newLines = jsyaml.safeDump(properties, { indent: 4 }).split('\n');
        const bodyLines = body.split('\n');

        bodyLines.splice(indexLine, 0, newLines.map(line => numberSpace + line).join('\n'));
        generator.fs.write(file, bodyLines.join('\n'));
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const properties = {};
        updatePropertyInArray(properties, property, generator, value);
        addYamlPropertiesAtBeginin(file, properties, generator);
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const properties = {};
        updatePropertyInArray(properties, property, generator, value);
        addYamlPropertiesAtEnd(file, properties, generator);
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const properties = {};
        updatePropertyInArray(properties, property, generator, value);
        addYamlPropertiesBeforeAnotherProperty(file, properties, generator, propertyBefore, addBeforeComment);
    } catch (e) {
        generator.log(e);
    }
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
    try {
        const properties = {};
        updatePropertyInArray(properties, property, generator, value);
        addYamlPropertiesAfterAnotherProperty(file, properties, generator, propertyAfter);
    } catch (e) {
        generator.log(e);
    }
}

/**
 * Add yaml properties at a specific line
 *
 * @param {string} file - yaml file to update
 * @param {string} property - property name
 * @param {string} value - value of property
 * @param {string} generator - The generator
 * @param {string} indexLine - Index of line which we wish to insert new properties
 */
function addYamlPropertyAtLineIndex(file, property, value, generator, indexLine) {
    try {
        const properties = {};
        updatePropertyInArray(properties, property, generator, value);
        addYamlPropertiesAtLineIndex(file, properties, generator, indexLine);
    } catch (e) {
        generator.log(e);
    }
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
 * @param {string} addBeforeComment - (Optional) if this variable is defined, means that we will return the index before the previuous comment of the property.
 */
function getIndexBeforeLineOfProperty(body, property, generator, addBeforeComment) {
    try {
        const lines = body.split('\n');

        let otherwiseLineIndex = -1;
        lines.some((line, i) => {
            if ((line.indexOf('#') === -1) && (line.indexOf(`${property}:`) !== -1)) {
                generator.log(line);
                otherwiseLineIndex = i;
                return true;
            }
            return false;
        });

        if (addBeforeComment) {
            for (let i = otherwiseLineIndex - 1; i > 0; i--) {
                if (lines[i].indexOf('#') !== -1 || (/^\s*$/.test(lines[i]))) {
                    otherwiseLineIndex = i;
                } else {
                    break;
                }
            }
        }
        return otherwiseLineIndex;
    } catch (e) {
        generator.log(e);
        return -1;
    }
}

/**
 * get index of line of property
 *
 * @param {string} body - String body to search
 * @param {string} property - property name to search
 * @param {string} generator - The generator
 */
function getIndexAfterLineOfProperty(body, property, generator, addBeforeComment) {
    try {
        const lines = body.split('\n');
        // generator.log('property : ' + property);
        let otherwiseLineIndex = -1;
        let curr;
        const namePath = property.split('.');
        // generator.log('namePath : ' + namePath);

        while ((curr = namePath.splice(0, 1)[0]) !== undefined) {
            // generator.log('cur props : ' + curr);
            lines.some((line, i) => {
                // generator.log(line);
                if ((line.indexOf('#') === -1) && (line.indexOf(`${curr}:`) !== -1)) {
                    otherwiseLineIndex = i;
                    return true;
                }
                return false;
            });
        }
        // generator.log('indexe line : ' + otherwiseLineIndex);
        if (otherwiseLineIndex === -1) {
            return otherwiseLineIndex;
        }
        let spaces = 0;
        while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
            spaces += 1;
        }
        // generator.log('space number : ' + spaces);
        let spacesNext = 0;
        for (let i = otherwiseLineIndex + 1; i < lines.length; i++) {
            // generator.log('next line : ' + lines[i]);
            // si la ligne suivante a le meme nombre d'espace que la propriéte, on considere que c'est une nouvelle propriété
            spacesNext = 0;
            while (lines[i].charAt(spacesNext) === ' ') {
                spacesNext += 1;
            }
            // generator.log('next line space: ' +spacesNext);
            if (spaces !== spacesNext) {
                otherwiseLineIndex = i;
            } else {
                break;
            }
        }

        return otherwiseLineIndex + 1;
    } catch (e) {
        generator.log(e);
        return -1;
    }
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

        const body = generator.fs.read(file);

        const propExist = getLastPropertiesCommonHierarchy(body, properties, generator);

        if (propExist !== undefined) {
            propertyParentFound = true;
            // generator.log(`Property commune ${propExist} FOUND\n`);
            const arrPropExist = propExist.split('.');
            let spaces = arrPropExist.length * 4;
            let spaceStr = '';

            while ((spaces -= 1) >= 0) { // eslint-disable-line no-cond-assign
                spaceStr += ' ';
            }
            const indexLineProps = getIndexAfterLineOfProperty(body, propExist, generator);
            // generator.log("line index " + indexLineProps);

            let removeArray = properties;
            for (let i = 0; i < arrPropExist.length; i++) {
                removeArray = removeArray[arrPropExist[i]];
            }
            // generator.log(removeArray);

            addYamlPropertiesAtLineIndex(file, removeArray, generator, indexLineProps, spaceStr);
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
