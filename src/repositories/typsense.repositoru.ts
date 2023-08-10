
import { Injectable } from '@nestjs/common';
import { MediaDto } from 'src/dto/media/media.dto';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { MultiSearchRequestsSchema } from 'typesense/lib/Typesense/MultiSearch';


@Injectable()
export class TypesenseRepository {


    private client: Client;

    constructor() {
        //return;
        this.client = new Client({
            nodes: [{
                host: '127.0.0.1',
                port: 8108,
                protocol: 'http'
            }],
            apiKey: 'xyz',
            connectionTimeoutSeconds: 2
        })

        this.setup();
    }

    private async setup() {
        let typeSenseMediaSchema: CollectionCreateSchema = {
            name: 'media',
            fields: [
                { name: 'id', type: 'string' },
                //{ name: 'width', type: 'int32' },
                //{ name: 'height', type: 'int32' },
                //{ name: 'path', type: 'string' },
                //{ name: 'lat', type: 'int32' },
                //{ name: 'lon', type: 'int32' },
                //{ name: 'mediaType', type: 'string', facet: true },
                { name: 'clipEmbeddings', type: 'float[]', facet: false, optional: true, num_dim: 512}
            ],
            enable_nested_fields: true
        }

        const collection = await this.client
            .collections('media')
            .retrieve()
            .catch(() => null);

        if (!collection) {
            this.client.collections().create(typeSenseMediaSchema)
                .then(function (data) {
                    console.log("collection created")
                }).catch(function (error) {
                    console.error('Error creating collection:', error);
                });
        } else {
            console.log("collection already exists")
        }
    }

    async insertDocument(createMediaDto: any) {
        await this.client.collections('media').documents().create(createMediaDto);

        // Search for all documents (including the newly inserted one)
        /*const searchQuery = {
            q: '*',
            preset: ''
        };

        try {
            // Perform the search and await the result
            const result = await this.client.collections('media').documents().search(searchQuery);

            // Convert the search result to a string and return
            return result;
        } catch (error) {
            console.error('Error performing search:', error);
            throw error;
        }*/

    }

    async addClipEmbeddings(documentId: string, vector: number[]) {
        const existingDocument = await this.client.collections('media').documents(documentId).retrieve()
        const updateDocument = {
            ...existingDocument,
            clipEmbedding: vector
        }
        return await this.client.collections('media').documents().upsert(updateDocument);
    }

    async fetchDocument(documentId: string) {
        return await this.client.collections('media').documents(documentId).retrieve();
    }

    async fetchAllDocuments() {
        const searchQuery = {
            q: '*',
            preset: '',
            
        };
        return await this.client.collections('media').documents().search(searchQuery);
    }

    async searchDocuments(searchVector: number[]) {
        const { results } = await this.client.multiSearch.perform({
            searches: [
                {
                    collection: 'media',
                    q: '*',
                    vector_query: `clipEmbeddings:([${searchVector.join(',')}], k:100)`,
                    per_page: 100,
                } as any
            ]
        });

        return {
            mediaId: (results[0]?.hits || []).map(item => {
                //@ts-ignore
                return item.document.id;

            })
        }
        //console.log(searchQuery);
        //return await this.client.multiSearch.perform(searchQuery, {});
    }

}