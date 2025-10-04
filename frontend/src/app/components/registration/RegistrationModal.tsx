import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonTitle?: string;
}
export function RegistrationModal({
  isOpen,
  onClose,
  hackathonTitle
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    githubLink: '',
    twitterLink: '',
    telegramHandle: '',
    wechatHandle: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the registration submission
    console.log('Registration submitted:', formData);
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 bg-[#111111] border-[#2a2a2a] text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="flex items-center text-gray-400 hover:text-white">
              <X className="h-4 w-4 mr-2" />
              <span>Quit registration</span>
            </button>
            <div className="flex items-center">
              <X className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-lg font-medium">Athena X</span>
            </div>
          </div>
          <div className="h-1 bg-blue-500 w-full -mx-6 my-4"></div>
          <DialogTitle className="text-2xl font-bold text-center">
            Register to hackathon!
          </DialogTitle>
        </DialogHeader>

        <div className="text-gray-400 text-center mb-6">
          <p>We need some of your info to join the hackathon.</p>
          <p>We'll save it and add it automatically next time</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jack Dorcey"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubLink">Github Link</Label>
            <Input
              type="url"
              id="githubLink"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              placeholder="https://github.com/jackjackbits/bitchat/tree/main?tab="
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterLink">
              Twitter Link <span className="text-gray-500">(Optional)</span>
            </Label>
            <Input
              type="url"
              id="twitterLink"
              name="twitterLink"
              value={formData.twitterLink}
              onChange={handleChange}
              placeholder="https://x.com/0xLungu"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegramHandle">Telegram Handle</Label>
            <Input
              type="text"
              id="telegramHandle"
              name="telegramHandle"
              value={formData.telegramHandle}
              onChange={handleChange}
              placeholder="Your Telegram Handle"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wechatHandle">WeChat Handle</Label>
            <Input
              type="text"
              id="wechatHandle"
              name="wechatHandle"
              value={formData.wechatHandle}
              onChange={handleChange}
              placeholder="Your WeChat Handle"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3">
              Finish Registration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}