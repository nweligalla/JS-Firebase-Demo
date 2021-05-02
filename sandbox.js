const list = document.querySelector('ul');

const form = document.querySelector('form');

const button = document.querySelector('button');

const addRecipe = (recipe, id) => {


    const html = `
        <li data-id="${id}">
            <div>${recipe.title}</div>
            <div>${recipe.created_at.toDate()}</div>
            <button class="btn btn-danger btn-sm my-2">Delete</button>
        </li>
    `;

    list.innerHTML += html;
};



//get docs on load
// db.collection('recipes').get()
//     .then(snapshot => {
//         snapshot.docs.forEach(doc => {
//             addRecipe(doc.data(), doc.id);
//         });
//     })
//     .catch(err => console.log(err));

//get docs from realtime listener
const unsub = db.collection('recipes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if (change.type === 'added') {
            addRecipe(doc.data(), doc.id);
        } else if (change.type === 'removed') {
            deleteRecipe(doc.id);
        }
    })
});



//add docs
form.addEventListener('submit', e => {
    e.preventDefault();

    const now = new Date();
    const recipe = {
        title: form.recipe.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection('recipes').add(recipe)
        .then(() => {
            console.log("recipe added");
        }).catch(err => console.log(err));
});




//delete docs from firebase
list.addEventListener('click', e => {

    if (e.target.tagName === 'BUTTON') {
        const id = e.target.parentElement.getAttribute('data-id');

        db.collection('recipes').doc(id).delete()
            .then(() => {
                console.log("recipe deleted");
            }).catch(err => console.log(err));

    }
});

//delete from UI
const deleteRecipe = (id) => {
    const recipes = document.querySelectorAll('li');

    recipes.forEach(recipe => {
        if (recipe.getAttribute('data-id') === id) {
            recipe.remove();
        }
    })
}

//Unsubscribe from RealTime changes in ui
button.addEventListener('click', () => {
    unsub();
    console.log('unsbscribed');
})