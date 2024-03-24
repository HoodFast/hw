const request = require('supertest');

import {routerPaths} from "../../../src/models/common/paths/paths";


export const getNewLike = (myStatus: string) => {
    return {likeStatus: myStatus}
}
export const likesPut = async (app:any, likeStatuses: string[], commentId:string, tokensList:string[]) => {
    for (let i = 0; i < likeStatuses.length; i++) {
        const res = await request(app)
            .put(routerPaths.comments + '/' + commentId + '/like-status')
            .set('Authorization', `Bearer ${tokensList[i]}`)
            .send(
                getNewLike(likeStatuses[i])
            ).expect(204)
    }
}