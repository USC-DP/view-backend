import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, of } from "rxjs";

@Injectable()
export class EmbeddingsService {
    constructor(private httpService: HttpService) { }

    getMediaEmbedding(mediaId: string): Observable<AxiosResponse<{ success: boolean, data?: number[] }>> {
        return this.httpService.get('http://127.0.0.1:5002/get-media-embedding?mediaId=' + mediaId);
    }

    getWordEmbedding(word: string): Observable<AxiosResponse<{ success: boolean, data?: number[] }>> {
        if (word == undefined || word == '') {
            const immediateResponse: AxiosResponse<{ success: boolean, data?: number[] }> = {
                data: { success: true, data: [] },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {headers: null}
            };
            return of(immediateResponse);

        }
        return this.httpService.get('http://127.0.0.1:5002/get-word-embedding?word=' + word);
    }
}