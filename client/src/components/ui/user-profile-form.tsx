import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar } from "lucide-react";

interface UserProfile {
  age: string;
  gender: string;
}

interface UserProfileFormProps {
  onProfileSubmit: (profile: UserProfile) => void;
}

export default function UserProfileForm({ onProfileSubmit }: UserProfileFormProps) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = () => {
    if (age && gender) {
      onProfileSubmit({ age, gender });
      // Guardar en localStorage para futuras sesiones
      localStorage.setItem("userProfile", JSON.stringify({ age, gender }));
    }
  };

  const isFormValid = age && gender;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Cuéntanos sobre ti
          </CardTitle>
          <CardDescription className="text-gray-300">
            Para brindarte el mejor apoyo psicológico personalizado
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Edad */}
          <div className="space-y-3">
            <Label className="text-white font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-nflow-orange" />
              ¿Cuál es tu edad?
            </Label>
            <Select value={age} onValueChange={setAge}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue placeholder="Selecciona tu edad" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="13-17" className="text-white hover:bg-gray-700">13-17 años</SelectItem>
                <SelectItem value="18-25" className="text-white hover:bg-gray-700">18-25 años</SelectItem>
                <SelectItem value="26-35" className="text-white hover:bg-gray-700">26-35 años</SelectItem>
                <SelectItem value="36-45" className="text-white hover:bg-gray-700">36-45 años</SelectItem>
                <SelectItem value="46-55" className="text-white hover:bg-gray-700">46-55 años</SelectItem>
                <SelectItem value="56+" className="text-white hover:bg-gray-700">56+ años</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sexo */}
          <div className="space-y-3">
            <Label className="text-white font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-nflow-orange" />
              Sexo
            </Label>
            <RadioGroup value={gender} onValueChange={setGender} className="space-y-2">
              <div className="flex items-center space-x-2 bg-gray-700/30 p-3 rounded-lg">
                <RadioGroupItem value="hombre" id="hombre" className="border-gray-600 text-nflow-orange" />
                <Label htmlFor="hombre" className="text-white cursor-pointer">Hombre</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700/30 p-3 rounded-lg">
                <RadioGroupItem value="mujer" id="mujer" className="border-gray-600 text-nflow-orange" />
                <Label htmlFor="mujer" className="text-white cursor-pointer">Mujer</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700/30 p-3 rounded-lg">
                <RadioGroupItem value="prefiero-no-contestar" id="prefiero-no-contestar" className="border-gray-600 text-nflow-orange" />
                <Label htmlFor="prefiero-no-contestar" className="text-white cursor-pointer">Prefiero no contestar</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comenzar Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}