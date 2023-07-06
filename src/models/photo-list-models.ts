interface ViewMediaMetadata  {
    mediaId: string,
    width: number,
    height: number
}
interface ViewMedia {
    mediaId: string,
    metadata: ViewMediaMetadata
}
interface ViewSegment {
    segmentId: string,
    media: ViewMedia[]
}
interface ViewSection {
    sectionId: string
    totalMedia: number
}