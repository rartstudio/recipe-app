export default class Likes {

    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);

        //persist data in localstorage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //persist data in localStorage
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        //localstorage can just save string so we need to parse it to string
        //transform array to string
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    readStorage(){
        //parsing data from string to a before structure data
        const storage = JSON.parse(localStorage.getItem('likes'));

        //if there is data on localstorage and parse it to object
        if (storage) this.likes = storage;
    }
}