import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import api from "@/services/api.service";
import { getErrorInformation } from "@/utilities/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiannualEvaluationSchema, EnumSemester, EnumSkillStatus, SkillSchema } from "@sigl/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

type skillType = z.infer<typeof SkillSchema.getData>;
const FormSchema = BiannualEvaluationSchema.sendData;

export const BiEvalForm = ({ apprenticeId }: { apprenticeId: number }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<skillType[]>([]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState<number>(-1);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      trainingDiaryId: 0,
    },
  });

  form.watch(
    currentSkillIndex >= 0
      ? `skillEvaluations.${currentSkillIndex}.status`
      : `skillEvaluations.0.status`,
  );

  const { append } = useFieldArray({
    control: form.control,
    name: "skillEvaluations",
  });

  useEffect(() => {
    api.get("/biannualEvaluations/skills").then(
      (response) => {
        switch (response.status) {
          case 200:
            setSkills(response.data.data);
            form.reset();
            response.data.data.forEach((skill: skillType) => {
              append({
                skillId: skill.id,
                status: EnumSkillStatus.empty,
                comment: "",
              });
            });
            setLoading(false);
            break;
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || t("globals.error.connection"));
      },
    );

    api.get(`/diary/user/${apprenticeId}`).then(
      (response) => {
        switch (response.status) {
          case 200:
            console.log(response.data.data.id);
            form.setValue("trainingDiaryId", response.data.data.id);
            break;
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || t("globals.error.connection"));
      },
    );
  }, []);

  useEffect(() => {
    if (currentSkillIndex >= 0 && skills[currentSkillIndex]) {
      const currentValues = form.getValues(`skillEvaluations.${currentSkillIndex}`);

      form.setValue(
        `skillEvaluations.${currentSkillIndex}`,
        {
          ...currentValues,
          skillId: skills[currentSkillIndex].id,
          status: currentValues?.status || EnumSkillStatus.empty,
          comment: currentValues?.comment || "",
        },
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        },
      );
    }
  }, [currentSkillIndex, skills, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setOpen(false);
    setLoading(false);
    setCurrentSkillIndex(-1);

    api.post("/biannualEvaluations", data).then(
      (response) => {
        switch (response.status) {
          case 200:
            toast.success(t("globals.success"));
            break;
        }
      },
      (err) => {
        const error = getErrorInformation(err.status);
        toast.error(error?.description || t("globals.error.connection"));
      },
    );

    form.reset();
    // TODO: Find a better way to refresh the page
    window.location.reload();
  };

  const onExit = () => {
    setOpen(false);
    setCurrentSkillIndex(-1);
    form.reset();
  };

  const nextSkill = () => {
    if (currentSkillIndex < skills.length - 1) {
      const currentValues = form.getValues(`skillEvaluations.${currentSkillIndex}`);
      form.setValue(`skillEvaluations.${currentSkillIndex}`, currentValues);
      setCurrentSkillIndex((prev) => prev + 1);
    }
  };

  const previousSkill = () => {
    if (currentSkillIndex > 0) {
      const currentValues = form.getValues(`skillEvaluations.${currentSkillIndex}`);
      form.setValue(`skillEvaluations.${currentSkillIndex}`, currentValues);
      setCurrentSkillIndex((prev) => prev - 1);
    } else {
      setCurrentSkillIndex(-1);
    }
  };

  const isNextButtonDisabled =
    currentSkillIndex >= 0 &&
    (form.getValues(`skillEvaluations.${currentSkillIndex}.status`) === EnumSkillStatus.empty ||
      !form.getValues(`skillEvaluations.${currentSkillIndex}.status`));
  const isSemesterNextButtonDisabled = currentSkillIndex === -1 && !form.getValues("semester");

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="add"
              onClick={() => setOpen(true)}
              className="p-2 flex flex-row justify-center gap-1"
            >
              <Plus className="h-5 w-5" />
              Ajouter
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ajouter une évaluation semestrielle</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={open ? onExit : setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une évaluation semestrielle</DialogTitle>
            <DialogDescription>
              Veuillez remplir les informations suivantes pour ajouter une évaluation semestrielle.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative grid gap-6 py-4">
              {currentSkillIndex === -1 && (
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Semestre</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                        <SelectTrigger className="bg-white rounded-[6px] border">
                          <SelectValue placeholder={"Choisir un semestre"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(EnumSemester).map((semester) => (
                              <SelectItem key={semester} value={semester}>
                                {t(`semesters.${semester}`)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              {!loading && skills.length > 0 && currentSkillIndex !== -1 && (
                <div className="space-y-4" key={`skill-form-${currentSkillIndex}`}>
                  <h5 className="font-medium text-xl">{skills[currentSkillIndex].name}</h5>

                  <FormField
                    control={form.control}
                    name={`skillEvaluations.${currentSkillIndex}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Statut</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value === EnumSkillStatus.empty ? "" : field.value}
                          disabled={loading}
                        >
                          <SelectTrigger className="bg-white rounded-[6px] border">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.values(EnumSkillStatus)
                                .filter((status) => status !== EnumSkillStatus.empty)
                                .map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {t(`skills.status.${status}`)}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`skillEvaluations.${currentSkillIndex}.comment`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Commentaire</FormLabel>
                        <Input
                          {...field}
                          placeholder="Ajouter un commentaire"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="flex justify-between mt-4">
                <div>
                  {currentSkillIndex !== -1 && (
                    <Button type="button" onClick={previousSkill} variant="outline">
                      Précédent
                    </Button>
                  )}
                </div>

                {currentSkillIndex === skills.length - 1 ? (
                  <Button type="submit" variant="user" disabled={loading || isNextButtonDisabled}>
                    {loading ? "Envoi en cours..." : "Envoyer"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="user"
                    onClick={(e) => {
                      e.preventDefault();
                      nextSkill();
                    }}
                    disabled={isNextButtonDisabled || isSemesterNextButtonDisabled}
                  >
                    Suivant
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
