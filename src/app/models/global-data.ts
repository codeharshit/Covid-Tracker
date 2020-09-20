export interface GlobalDataSummary { //Interface don't have implementation, they just define properties
                                    //for others to implement
    country ?: string,              // ?: means it's not a mandatory field
    confirmed ?: number,            // ?: means the data type can be anything except null, may have optional  
    deaths ?: number,               //    parameter
    recovered ?: number,            // For optional property, we dont have to provide implementation in class
    active ?: number                // https://www.youtube.com/watch?v=Be3-ZWtC1Lo&ab_channel=kudvenkat
}                                   //This link explain interfaces in Typescript