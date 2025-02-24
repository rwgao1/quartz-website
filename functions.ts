import { Options } from "./quartz/components/ExplorerNode"

const nameOrderMap: Record<string, [number, string]> = {
    "index": [0, "🏠"],
    "CV": [100, "📄"],
    "Research": [101, "👨‍🔬"],

    "Projects": [200, "📁"],
    "Projects/kan_tt_graphsage": [201, "🕸️"],
    "Projects/zo_snn": [202, "🧠"],
    "Projects/microcylinder": [203, "🛋️"],
    "Projects/3d_wfc": [204, "📦"],
    
    "Misc": [400, "💽"],
    "Misc/Piano": [401, "🎹"],
    "Misc/Succulents": [402, "🌵"],
}


export const mapFn: Options["mapFn"] = (node) => {
  // dont change name of root node
  if (node.depth > 0) {
    // set emoji for file/folder
    if (node.file && node.file.slug) {
        try {
            node.displayName = nameOrderMap[node.file.slug][1] + " " + node.displayName
        }
        catch (e) {
        }
    //   node.displayName = nameOrderMap[node.displayName][1] + " " + node.displayName
    } else if(node.name) {
        try {
            node.displayName = nameOrderMap[node.name][1] + " " + node.displayName
        }
        catch (e) {
        }
    //   node.displayName = nameOrderMap[node.displayName][1] + " " + node.displayName

    }
  }
}
export const filterFn: Options["filterFn"] = (node) => {
    return node.name !== "tags"
}


export const sortFn: Options["sortFn"] = (a, b) => {

    
   
    let orderA = 0
    let orderB = 0

    if (a.file && a.file.slug) {
        try {
            orderA = nameOrderMap[a.file.slug][0] || 0
        } catch (e) {
        }
    } else if (a.name) {
        try {
            orderA = nameOrderMap[a.name][0] || 0
        }
        catch (e) {
        }
    // orderA = nameOrderMap[a.name][0] || 0
    }

    if (b.file && b.file.slug) {
        try {
            orderB = nameOrderMap[b.file.slug][0] || 0
        }
        catch (e) {
        }
    // orderB = nameOrderMap[b.file.slug][0] || 0
    } else if (b.name) {
        try {
            orderB = nameOrderMap[b.name][0] || 0
        }
        catch (e) {
        }
    // orderB = nameOrderMap[b.name][0] || 0
    }

    return orderA - orderB
    
}