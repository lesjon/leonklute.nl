export default class Player{
    name: string;
    id?: number;
    title?: string;
    rating?: number;
    federation?: string;
    avatar?: string;
    
    constructor(name: string, id?: number, title?: string, rating?: number, federation?: string) {
        this.name = name;
        this.id = id;
        this.title = title;
        this.rating = rating;
        this.federation = federation;
    }
}