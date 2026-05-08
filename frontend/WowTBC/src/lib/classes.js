import { Items, Professions} from 'wow-classic-items';

const items = new Items();

const classSubClassCombinations = {};

const itemClasses = [...new Set(items.map((item) => item.class))]
const subClasses = [...new Set(items.map((item) => item.subclass))]


for (let i of items) {
    if (classSubClassCombinations[i.class]) {
        if (!classSubClassCombinations[i.class].includes(i.subclass)) {
            classSubClassCombinations[i.class].push(i.subclass);
        }
    } else {
        classSubClassCombinations[i.class] = [i.subclass];
    }
}

console.log(subClasses)

    // if (classSubClassCombinations[item.itemClass]) {
    //     classSubClassCombinations[item.itemClass].push(item.subclass);
    // } else {
    //     classSubClassCombinations[item.itemClass] = [item.subclass];

