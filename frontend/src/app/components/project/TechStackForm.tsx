import React, { useState } from 'react';
import { Link2, Upload, X, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
export function TechStackForm() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'Next', 'Web3']);
  const [availableTags, setAvailableTags] = useState<string[]>(['React', 'Next', 'Vue', 'Web3', 'Ethers', 'Node', 'Java', 'Go', 'Python', 'Solidity', 'Rust', 'Move']);
  const [tagInput, setTagInput] = useState('');
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  return <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* GitHub Link */}
        <div className="space-y-2">
          <Label htmlFor="githubLink">Github Link</Label>
          <Input
            type="url"
            id="githubLink"
            placeholder="https://"
            className="bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500"
          />
        </div>
        {/* Demo Video */}
        <div className="space-y-2">
          <Label>Demo Video</Label>
          <div className="border border-[#2a2a2a] rounded-lg bg-[#111111] aspect-video flex flex-col items-center justify-center p-6">
            <div className="flex gap-4">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Link2 className="h-4 w-4" />
                Add Video Link
              </Button>
            </div>
          </div>
        </div>
        {/* Tech Stack Tags */}
        <div className="space-y-2">
          <Label>Tech Stack Tags</Label>
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-[#111111] border-[#2a2a2a] text-white">
                {tag}
                <button
                  className="text-gray-400 hover:text-white ml-1"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Input
              type="text"
              placeholder="Enter Tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="bg-[#111111] border-[#2a2a2a] text-white focus:ring-blue-500 min-w-[100px] h-8"
            />
          </div>
          {/* Available Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
              <Button
                key={tag}
                variant="outline"
                className="px-3 py-1 text-sm bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-gray-400 hover:text-white"
                onClick={() => addTag(tag)}
              >
                + {tag}
              </Button>
            ))}
          </div>
          {/* Add New Tag Button */}
          <Button
            variant="outline"
            className="w-full py-2 border-dashed border-[#2a2a2a] text-gray-400 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center"
            onClick={() => {
              if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
                addTag(tagInput.trim());
                setTagInput('');
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Tag
          </Button>
        </div>
      </div>
    </div>;
}