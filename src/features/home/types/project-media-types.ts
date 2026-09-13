export interface ProjectMediaResponse {
  collection: {
    href: string
    items: {
      data: DataItem[]
      href: string
      links: LinkItems[]
    }[]
  }
}

export interface DataItem {
  center: string
  date_created: Date
  description: string
  description_508: string
  keywords: string[]
  media_type: string
  nasa_id: string
  secondary_creator: string
  title: string
  album: string[]
}

export interface LinkItems {
  href: string
  rel: string
  render: string
  width: number
  size: number
  height: number
}
