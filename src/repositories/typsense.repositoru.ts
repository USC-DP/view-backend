
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
    }

    async instantiate() {
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

        return this.setup();
    }

    private async setup() {
        let typeSenseMediaSchema: CollectionCreateSchema = {
            name: 'media',
            fields: [
                { name: 'id', type: 'string' },
                { name: 'segmentId', type: 'string', facet: true },
                { name: 'sectionId', type: 'string', facet: true },
                { name: 'width', type: 'int32' },
                { name: 'height', type: 'int32' },
                { name: 'date', type: 'int64' },
                { name: 'ownerId', type: 'string' },
                //{ name: 'lat', type: 'int32' },
                //{ name: 'lon', type: 'int32' },
                //{ name: 'mediaType', type: 'string', facet: true },
                { name: 'clipEmbeddings', type: 'float[]', facet: false, optional: true, num_dim: 512 }
            ],
            enable_nested_fields: true
        }

        const collection = await this.client
            .collections('media')
            .retrieve()
            .catch(() => null);

        if (!collection) {
            return this.client.collections().create(typeSenseMediaSchema);
        } else {
            console.log("collection already exists");
            return Promise.reject(false);
        }
    }

    async insertDocument(createMediaDto: any) {
        // sectionId and segmentId
        await this.client.collections('media').documents().create(createMediaDto);
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

    /*async searchDocuments(searchVector: number[]) {
        const { results } = await this.client.multiSearch.perform({
            searches: [
                {
                    collection: 'media',
                    q: '*',
                    vector_query: `clipEmbeddings:([${searchVector.join(',')}], k:10)`,
                    per_page: 100,
                } as any
            ]
        });

        return results;

        return {
            mediaId: (results[0]?.hits || []).map(item => {
                //@ts-ignore
                return item.document.id;

            })
        }
        //console.log(searchQuery);
        //return await this.client.multiSearch.perform(searchQuery, {});
    }*/

    //YYYY-MM
    async getMediaSectionsFromDocuments(userId: string, searchVector: number[]) {

        const { results } = await this.client.multiSearch.perform({
            searches: [
                {
                    collection: 'media',
                    q: '*',
                    facet_by: 'sectionId',
                    filter_by: `ownerId:${userId}`,
                    ...(searchVector.length > 0 ? { vector_query: `clipEmbeddings:([${searchVector.join(',')}], k:10)` } : {}),
                    per_page: 100,
                } as any
            ]
        });

        return this.formatSectionsFromTypesense(results, searchVector);

        const facetCounts = results[0].facet_counts[0].counts;
        const convertedArray = facetCounts.map(item => ({
            sectionId: item.value,
            totalMedia: item.count
        }));

        // Sort the array by descending dates
        //@ts-ignore
        convertedArray.sort((a, b) => new Date(b.sectionId) - new Date(a.sectionId));

        return convertedArray
    }

    formatSectionsFromTypesense(input: any, searchVector: number[]) {
        const threshold = 0.778; // Specify your threshold value

        const sectionMap = new Map();

        input.forEach(item => {
            if (item.hits) {
                item.hits.forEach(hit => {
                    if (hit.document && hit.document.sectionId && (hit.vector_distance < threshold || searchVector.length == 0)) {
                        //console.log(hit.vector_distance)
                        const sectionId = hit.document.sectionId;
                        if (sectionMap.has(sectionId)) {
                            sectionMap.set(sectionId, sectionMap.get(sectionId) + 1);
                        } else {
                            sectionMap.set(sectionId, 1);
                        }
                    }
                });
            }
        });

        const output_data = Array.from(sectionMap.entries()).map(([sectionId, totalMedia]) => ({
            sectionId: sectionId,
            totalMedia: totalMedia
        }));

        //@ts-ignore
        output_data.sort((a, b) => new Date(b.sectionId) - new Date(a.sectionId));

        return output_data

    }

    formatSegmentsFromTypsense(input: any) {
        let output = []
        input.forEach(item => {
            if (item.hits) {
                item.hits.forEach(hit => {
                    if (hit.document && hit.document.segmentId && hit.document.id) {
                        const segmentId = hit.document.segmentId;
                        const mediaId = hit.document.id;
                        const width = hit.document.width;
                        const height = hit.document.height;

                        // Check if the segment already exists in output_data
                        let found = false;
                        output.forEach(segment => {
                            if (segment.segmentId === segmentId) {
                                segment.media.push({
                                    width: width,
                                    height: height,
                                    mediaId: mediaId
                                });
                                found = true;
                            }
                        });

                        // If segment doesn't exist, create a new one
                        if (!found) {
                            output.push({
                                segmentId: segmentId,
                                media: [{
                                    width: width,
                                    height: height,
                                    mediaId: mediaId
                                }]
                            });
                        }
                    }
                });
            }
        });
        return output;

    }

    async getSegmentsForSearchTerm(userId: string, sectionId: string, searchVector: number[], amountFromSection: number) {
        const { results } = await this.client.multiSearch.perform({
            searches: [
                {
                    collection: 'media',
                    q: '*',
                    sort_by: 'date:desc',
                    filter_by: `sectionId: ${sectionId} && ownerId:${userId}`,
                    ...(searchVector.length > 0 ? { vector_query: `clipEmbeddings:([${searchVector.join(',')}], k:100)` } : {}),
                    per_page: amountFromSection,
                } as any
            ]
        });

        return this.formatSegmentsFromTypsense(results);
    }

}