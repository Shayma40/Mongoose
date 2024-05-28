// Require Mongoose and set up connection to MongoDB Atlas database URI stored in .env
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log('Connected to MongoDB database');
});

// Define Person schema with basic Mongoose schema types and required field
const PersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String],
});

// Create Person model from the schema
const Person = mongoose.model('Person', PersonSchema);

// --- Create and Save a Record of a Model ---
function createAndSavePerson(personDetails, done) {
    const person = new Person(personDetails);

    person.save((err, data) => {
        if (err) {
            console.error(err);
            return done(err);
        }
        console.log('Person saved successfully:', data);
        done(null, data);
    });
}

// Example usage
const personData = {
    name: 'Alice Johnson',
    age: 28,
    favoriteFoods: ['tacos', 'salad'],
};
createAndSavePerson(personData, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Create Many Records with model.create() ---
function createManyPeople(arrayOfPeople, done) {
    Person.create(arrayOfPeople, (err, data) => {
    if (err) {
        console.error(err);
        return done(err);
    }
    console.log('People created successfully:', data);
    done(null, data);
    });
}

// Example usage
const arrayOfPeople = [
    { name: 'Bob Smith', age: 34, favoriteFoods: ['ramen', 'burger'] },
    { name: 'Cathy Brown', age: 29, favoriteFoods: ['pasta', 'ice cream'] },
];
createManyPeople(arrayOfPeople, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Use model.find() to Search Your Database ---
function findPeopleByName(name, done) {
    Person.find({ name }, (err, data) => {
    if (err) {
        console.error(err);
        return done(err);
    }
    console.log('People found with name', name, ':', data);
    done(null, data);
    });
}

// Example usage
const searchName = 'Alice Johnson';
findPeopleByName(searchName, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Use model.findOne() to Return a Single Matching Document ---
function findPersonByFavoriteFood(food, done) {
    Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) {
        console.error(err);
        return done(err);
    }
    console.log('Person found with favorite food', food, ':', data);
    done(null, data);
    });
}

// Example usage
const favoriteFood = 'ramen';
findPersonByFavoriteFood(favoriteFood, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Use model.findById() to Search Your Database By _id ---
function findPersonById(personId, done) {
    Person.findById(personId, (err, data) => {
    if (err) {
        console.error(err);
        return done(err);
    }
    console.log('Person found with ID', personId, ':', data);
    done(null, data);
    });
}

// Example usage (replace with actual person ID)
const personId = 'your_person_id_here';
findPersonById(personId, (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Perform Classic Updates by Running Find, Edit, then Save ---
function updatePersonAddFavoriteFood(personId, newFavoriteFood, done) {
    Person.findById(personId, (err, person) => {
    if (err) {
        console.error(err);
        return done(err);
    }

    person.favoriteFoods.push(newFavoriteFood);
    person.save((err, updatedPerson) => {
        if (err) {
        console.error(err);
        return done(err);
        }
        console.log('Updated person:', updatedPerson);
        done(null, updatedPerson);
    });
    });
}

// Example usage (replace with actual person ID)
updatePersonAddFavoriteFood('your_person_id_here', 'sushi', (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Perform New Updates on a Document Using model.findOneAndUpdate() ---
function findAndUpdate(personName, done) {
    Person.findOneAndUpdate(
    { name: personName },
    { age: 35 },
    { new: true },
    (err, updatedPerson) => {
        if (err) {
        console.error(err);
        return done(err);
        }
        console.log('Updated person:', updatedPerson);
        done(null, updatedPerson);
    }
    );
}

// Example usage
findAndUpdate('Bob Smith', (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Delete One Document Using model.findByIdAndRemove ---
function removeById(personId, done) {
    Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) {
        console.error(err);
        return done(err);
    }
    console.log('Removed person:', removedPerson);
    done(null, removedPerson);
    });
}

// Example usage (replace with actual person ID)
removeById('your_person_id_here', (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Delete Many Documents with model.remove() ---
function removeManyPeople(name, done) {
    Person.remove({ name }, (err, result) => {
    if (err) {
        console.error(err);
        return done(err);
    }
    console.log('People removed:', result);
    done(null, result);
    });
}

// Example usage
removeManyPeople('Mary', (err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// --- Chain Search Query Helpers to Narrow Search Results ---
function queryChain(done) {
    Person.find({ favoriteFoods: 'sushi' })
    .sort({ name: 1 })
    .limit(2)
    .select('-age')
    .exec((err, data) => {
        if (err) {
        console.error(err);
        return done(err);
        }
        console.log('People who like sushi:', data);
        done(null, data);
    });
}

// Example usage
queryChain((err, data) => {
    if (err) console.error(err);
    else console.log('Query chain completed:', data);
});
