
interface ViewMedia {
    mediaId: string,
    width: number,
    height: number
}

interface ViewSegment {
    segmentId: string,
    media: ViewMedia[]
}
interface ViewSection {
    sectionId: string
    totalMedia: number
}