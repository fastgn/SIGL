"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from "./input";

type Option = { label: string; value: string };

interface ISelectProps {
  placeholder: string;
  options: Option[];
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

const MultiSelect = ({
  placeholder,
  options: values,
  selectedOptions: selectedItems,
  setSelectedOptions: setSelectedItems,
}: ISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<string | number>("auto");
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(values);

  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => {
        if (!prev) {
          return [value];
        }
        return [...prev, value];
      });
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems.includes(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchValue(searchTerm);
    const filtered = values.filter((option) => option.label.toLowerCase().includes(searchTerm));
    setFilteredOptions(filtered);
  };

  useEffect(() => {
    if (triggerRef.current) {
      setDropdownWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current?.offsetWidth]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger asChild className="w-full">
          <div ref={triggerRef} className="w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between shadow-none"
            >
              <div className="text-sm font-normal">
                {selectedItems.length > 0 ? (
                  <div className="flex gap-2 flex-wrap h-6 overflow-hidden">
                    {selectedItems.map((selectedValue) => {
                      const selectedLabel =
                        values.find((option) => option.value === selectedValue)?.label ||
                        selectedValue;
                      return (
                        <Badge
                          key={selectedValue}
                          variant={"secondary"}
                          className="flex items-center gap-2 px-2"
                        >
                          {selectedLabel}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-400">{placeholder}</span>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 opacity-50" />
              ) : (
                <ChevronDown className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          style={{ width: dropdownWidth }}
          className="w-full max-h-60 overflow-y-auto"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="sticky -top-1 bg-white z-10 p-2 border-b">
            <Input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              ref={searchInputRef}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>

          <div>
            {filteredOptions.map((value, index) => (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(value.value)}
                onCheckedChange={() => handleSelectChange(value.value)}
              >
                {value.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MultiSelect;
