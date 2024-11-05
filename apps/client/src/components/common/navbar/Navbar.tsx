import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SearchBar, SearchBarProps } from "@/components/common/navbar/SearchBar.tsx";


const filters = [
  { id: "category", name: "Catégorie" },
  { id: "brand", name: "Marque" },
  { id: "price", name: "Prix" },
  { id: "color", name: "Couleur" },
]

const sortOptions = [
  { id: "price-asc", name: "Prix croissant" },
  { id: "price-desc", name: "Prix décroissant" },
  { id: "name-asc", name: "Nom A-Z" },
  { id: "name-desc", name: "Nom Z-A" },
  { id: "newest", name: "Plus récent" },
]



export const  Navbar = ({ searchTerm, onSearchChange }: SearchBarProps) => {

  return (
    <div className="flex w-full h-fit items-center justify-between px-[0.75rem] py-[0.75rem] bg-blue-10 shadow-0 rounded-[1.125rem]">
    <div className="flex items-center gap-[1.25rem]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Filtre</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {filters.map((filter) => (
                  <li key={filter.id} className="row-span-3">
                    <NavigationMenuLink asChild>
                      <div className="flex items-center space-x-2">
                        <Checkbox id={filter.id} />
                        <Label htmlFor={filter.id}>{filter.name}</Label>
                      </div>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Tri</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-4">
                <RadioGroup defaultValue="price-asc">
                  {sortOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>{option.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange}/>
    </div>
  );
};