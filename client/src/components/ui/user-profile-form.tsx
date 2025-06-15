import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Heart, Calendar } from "lucide-react";

interface UserProfile {
  ageRange: string;
  gender: string;
  orientation: string;
}

interface UserProfileFormProps {
  onProfileSubmit: (profile: UserProfile) => void;
}

export default function UserProfileForm({ onProfileSubmit }: UserProfileFormProps) {
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");

  const handleSubmit = () => {
    if (ageRange && gender && orientation) {
      onProfileSubmit({ ageRange, gender, orientation });
      // Guardar en localStorage para futuras sesiones
      localStorage.setItem("userProfile", JSON.stringify({ ageRange, gender, orientation }));
    }
  };

  const isFormValid = ageRange && gender && orientation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-nflow-orange to-nflow-orange-light rounded-xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Personaliza tu experiencia
          </CardTitle>
          <CardDescription className="text-gray-300">
            Ayúdanos a adaptar NEUROPSI-AI a tu perfil para brindarte un apoyo más personalizado
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Edad */}
          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              ¿Cuál es tu rango de edad?
            </Label>
            <Select onValueChange={setAgeRange}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                <SelectValue placeholder="Selecciona tu edad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="13-17">13-17 años (Adolescente)</SelectItem>
                <SelectItem value="18-25">18-25 años (Joven adulto)</SelectItem>
                <SelectItem value="26-35">26-35 años (Adulto joven)</SelectItem>
                <SelectItem value="36-50">36-50 años (Adulto)</SelectItem>
                <SelectItem value="51-65">51-65 años (Adulto maduro)</SelectItem>
                <SelectItem value="65+">65+ años (Adulto mayor)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Género */}
          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <User className="w-4 h-4" />
              ¿Cómo te identificas?
            </Label>
            <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 bg-gray-700/30 p-3 rounded-lg">
                <RadioGroupItem value="mujer" id="mujer" />
                <Label htmlFor="mujer" className="text-white cursor-pointer">Mujer</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700/30 p-3 rounded-lg">
                <RadioGroupItem value="hombre" id="hombre" />
                <Label htmlFor="hombre" className="text-white cursor-pointer">Hombre</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-700/30 p-3 rounded-lg col-span-2">
                <RadioGroupItem value="no-binario" id="no-binario" />
                <Label htmlFor="no-binario" className="text-white cursor-pointer">No binario / Otro</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Orientación Sexual */}
          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <Heart className="w-4 h-4" />
              ¿Cuál es tu orientación sexual? (opcional pero ayuda a personalizar)
            </Label>
            <Select onValueChange={setOrientation}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600/50 text-white">
                <SelectValue placeholder="Selecciona tu orientación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heterosexual">Heterosexual</SelectItem>
                <SelectItem value="homosexual">Homosexual</SelectItem>
                <SelectItem value="bisexual">Bisexual</SelectItem>
                <SelectItem value="pansexual">Pansexual</SelectItem>
                <SelectItem value="asexual">Asexual</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
                <SelectItem value="prefiero-no-decir">Prefiero no decir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-nflow-orange to-nflow-orange-light hover:from-nflow-orange-light hover:to-nflow-orange text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            Comenzar mi sesión con NEUROPSI-AI
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Esta información es confidencial y solo se usa para personalizar tu experiencia terapéutica.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}