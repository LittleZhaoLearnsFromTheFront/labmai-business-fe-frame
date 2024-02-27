import { isDev } from "../constants"

const formatStatic = (image: string) => {
    if (isDev || image.startsWith('data:image')) return image
    const index = image.indexOf("/assets")
    return window.baseRoute + image.slice(index)
}
const images = import.meta.glob('@/assets/20230901/**.(png|jpeg|jpg)', { eager: true })
export const imageList = Object.keys(images).reduce((obj: { [key: string]: string }, item) => {
    const arr = item.split('/')
    const vendorName = arr[arr.length - 1].split('.')[0]
    obj[vendorName] = formatStatic((images[item] as { default: string }).default)
    return obj
}, {})