import { HsnCodeReference } from "./types";

// HSN Code data parsed from the tabular report
export const hsnCodes: HsnCodeReference[] = [
  // Structural Materials
  { prefixCode: "25-2523", codeName: "Portland Cement", materialName: "Ordinary Portland Cement (OPC)", gstRate: 28 },
  { prefixCode: "25-2523", codeName: "Portland Cement", materialName: "Portland Pozzolana Cement (PPC)", gstRate: 28 },
  { prefixCode: "25-2523", codeName: "White Cement", materialName: "White Cement", gstRate: 28 },
  { prefixCode: "25-2523", codeName: "Special Cement", materialName: "Rapid Hardening Cement", gstRate: 28 },
  { prefixCode: "25-2523", codeName: "Special Cement", materialName: "Sulphate Resistant Cement", gstRate: 28 },
  { prefixCode: "25-2505", codeName: "Natural Sands", materialName: "River Sand", gstRate: 5 },
  { prefixCode: "25-2505", codeName: "Natural Sands", materialName: "M-Sand (Manufactured Sand)", gstRate: 5 },
  { prefixCode: "25-2505", codeName: "Natural Sands", materialName: "Pit Sand", gstRate: 5 },
  { prefixCode: "25-2505", codeName: "Natural Sands", materialName: "Filter Sand", gstRate: 5 },
  { prefixCode: "25-2517", codeName: "Construction Aggregates", materialName: "Stone Chips", gstRate: 5 },
  { prefixCode: "25-2517", codeName: "Construction Aggregates", materialName: "Crushed Stone", gstRate: 5 },
  { prefixCode: "25-2517", codeName: "Construction Aggregates", materialName: "Coarse Aggregates", gstRate: 5 },
  { prefixCode: "25-2517", codeName: "Construction Aggregates", materialName: "Fine Aggregates", gstRate: 5 },
  { prefixCode: "25-2517", codeName: "Construction Aggregates", materialName: "Gravel", gstRate: 5 },
  { prefixCode: "68-6810", codeName: "Concrete Articles", materialName: "Concrete Blocks", gstRate: 28 },
  { prefixCode: "68-6810", codeName: "Concrete Articles", materialName: "Cement Pavers", gstRate: 28 },
  { prefixCode: "68-6810", codeName: "Concrete Articles", materialName: "Precast Concrete Elements", gstRate: 28 },
  { prefixCode: "68-6810", codeName: "Concrete Articles", materialName: "Hollow Blocks", gstRate: 28 },
  { prefixCode: "69-6901", codeName: "Building Bricks", materialName: "Red Clay Bricks", gstRate: 5 },
  { prefixCode: "69-6901", codeName: "Building Bricks", materialName: "Fly Ash Bricks", gstRate: 5 },
  { prefixCode: "69-6901", codeName: "Building Bricks", materialName: "Fire Bricks", gstRate: 5 },
  { prefixCode: "69-6904", codeName: "Special Bricks", materialName: "Acid-Resistant Bricks", gstRate: 12 },
  { prefixCode: "69-6904", codeName: "Special Bricks", materialName: "Engineering Bricks", gstRate: 12 },
  { prefixCode: "69-6904", codeName: "Special Bricks", materialName: "Face Bricks", gstRate: 12 },
  { prefixCode: "69-6904", codeName: "Special Bricks", materialName: "Sand Lime Bricks", gstRate: 12 },
  { prefixCode: "72-7213", codeName: "Iron/Steel Bars", materialName: "Reinforcement Bars (Rebars)", gstRate: 18 },
  { prefixCode: "72-7213", codeName: "Iron/Steel Bars", materialName: "TMT Bars", gstRate: 18 },
  { prefixCode: "72-7213", codeName: "Iron/Steel Bars", materialName: "Binding Wire", gstRate: 18 },
  { prefixCode: "72-7213", codeName: "Iron/Steel Bars", materialName: "MS Rods", gstRate: 18 },
  { prefixCode: "72-7214", codeName: "Other Iron/Steel Bars", materialName: "Angle Iron", gstRate: 18 },
  { prefixCode: "72-7214", codeName: "Other Iron/Steel Bars", materialName: "Square Bars", gstRate: 18 },
  { prefixCode: "72-7214", codeName: "Other Iron/Steel Bars", materialName: "Flat Bars", gstRate: 18 },
  { prefixCode: "72-7214", codeName: "Other Iron/Steel Bars", materialName: "Round Bars", gstRate: 18 },
  { prefixCode: "73-7308", codeName: "Structural Steel Components", materialName: "Structural Steel Beams", gstRate: 18 },
  { prefixCode: "73-7308", codeName: "Structural Steel Components", materialName: "Columns", gstRate: 18 },
  { prefixCode: "73-7308", codeName: "Structural Steel Components", materialName: "Trusses", gstRate: 18 },
  { prefixCode: "73-7308", codeName: "Structural Steel Components", materialName: "Steel Frames", gstRate: 18 },
  { prefixCode: "73-7308", codeName: "Structural Steel Components", materialName: "Base Plates", gstRate: 18 },
  
  // Finishing Materials
  { prefixCode: "69-6907", codeName: "Ceramic Tiles", materialName: "Floor Tiles", gstRate: 28 },
  { prefixCode: "69-6907", codeName: "Ceramic Tiles", materialName: "Wall Tiles", gstRate: 28 },
  { prefixCode: "69-6907", codeName: "Ceramic Tiles", materialName: "Vitrified Tiles", gstRate: 28 },
  { prefixCode: "69-6907", codeName: "Ceramic Tiles", materialName: "Porcelain Tiles", gstRate: 28 },
  { prefixCode: "69-6907", codeName: "Ceramic Tiles", materialName: "Mosaic Tiles", gstRate: 28 },
  { prefixCode: "68-6802", codeName: "Worked Stone", materialName: "Marble Slabs", gstRate: 18 },
  { prefixCode: "68-6802", codeName: "Worked Stone", materialName: "Granite Slabs", gstRate: 18 },
  { prefixCode: "68-6802", codeName: "Worked Stone", materialName: "Slate Tiles", gstRate: 18 },
  { prefixCode: "68-6802", codeName: "Worked Stone", materialName: "Stone Cladding", gstRate: 18 },
  { prefixCode: "25-2516", codeName: "Granite & Stone (Blocks)", materialName: "Granite Blocks", gstRate: 12 },
  { prefixCode: "25-2516", codeName: "Granite & Stone (Blocks)", materialName: "Marble Blocks", gstRate: 12 },
  { prefixCode: "25-2516", codeName: "Granite & Stone (Blocks)", materialName: "Building Stone Blocks", gstRate: 12 },
  { prefixCode: "25-2516", codeName: "Granite & Stone (Processed)", materialName: "Processed Stone Materials", gstRate: 18 },
  
  // Add more categories as needed from the HSN code report
];

// Helper function to get unique prefix codes
export function getUniqueHsnPrefixCodes(): { prefixCode: string, name: string }[] {
  const uniquePrefixCodes = new Map<string, string>();
  
  hsnCodes.forEach(code => {
    if (!uniquePrefixCodes.has(code.prefixCode)) {
      // Use the first code name as the category name
      uniquePrefixCodes.set(code.prefixCode, code.codeName);
    }
  });
  
  return Array.from(uniquePrefixCodes.entries()).map(([prefixCode, name]) => ({
    prefixCode,
    name
  }));
}

// Helper function to get unique code names for a specific prefix code
export function getHsnCodeNamesForPrefix(prefixCode: string): { codeName: string, defaultGstRate: number }[] {
  const codeNames = new Map<string, number>();
  
  hsnCodes
    .filter(code => code.prefixCode === prefixCode)
    .forEach(code => {
      if (!codeNames.has(code.codeName)) {
        codeNames.set(code.codeName, code.gstRate);
      }
    });
  
  return Array.from(codeNames.entries()).map(([codeName, defaultGstRate]) => ({
    codeName,
    defaultGstRate
  }));
}

// Helper function to get material names for a specific prefix code and code name
export function getMaterialNamesForCodeName(prefixCode: string, codeName: string): { materialName: string, gstRate: number }[] {
  return hsnCodes
    .filter(code => code.prefixCode === prefixCode && code.codeName === codeName)
    .map(code => ({
      materialName: code.materialName,
      gstRate: code.gstRate
    }));
}

// Helper function to find a specific HSN code reference
export function findHsnCodeReference(materialName: string): HsnCodeReference | undefined {
  return hsnCodes.find(code => code.materialName === materialName);
}

// Helper function to suggest HSN code references based on material name
export function suggestHsnCodeReferences(materialName: string): HsnCodeReference[] {
  const lowerCaseName = materialName.toLowerCase();
  return hsnCodes.filter(code => 
    code.materialName.toLowerCase().includes(lowerCaseName) ||
    code.codeName.toLowerCase().includes(lowerCaseName)
  );
}

// Helper function to generate a formatted HSN code string
export function formatHsnCode(prefixCode: string, codeName: string, materialName: string): string {
  return `${prefixCode} - ${codeName} - ${materialName}`;
}
