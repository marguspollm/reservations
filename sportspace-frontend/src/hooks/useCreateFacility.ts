import { useMemo, useState } from "react";
import type { FacilityRequest } from "../models/requests/FacilityRequest";
import { facilityObject } from "../utils/objects";
import { useNavigate } from "react-router";
import { useAsyncFetch } from "./useAsyncFetch";
import type { FacilityFormError } from "../models/FormErrors";
import { isChanged, validateFacilityForm } from "../utils/validations";
import { addFacility } from "../services/facility.service";
import { facilityFormActions } from "../utils/facilityFormActions";
import { t } from "i18next";

function useCreateFacility() {
  const navigate = useNavigate();
  const [facility, setFacility] = useState<FacilityRequest>(facilityObject);

  const [error, setError] = useState<string | null>(null);
  const [validateError, setValidateError] = useState<FacilityFormError>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { execute, loading } = useAsyncFetch();

  const formActions = facilityFormActions(setFacility);

  const save = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidateError({});

    const errors = validateFacilityForm(facility);
    if (Object.keys(errors).length !== 0) {
      setValidateError(errors);
      setError("error.missingformvalues");
      return;
    }

    try {
      await execute(addFacility, facility);
      setSuccessMessage(t("success.facility.created"));
      navigate("/facilities");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  };

  const cancel = () => {
    navigate(-1);
  };

  const handleChange = (field: string, value: unknown) => {
    setFacility(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const isDirty = useMemo(() => {
    return isChanged(facility, facilityObject);
  }, [facility]);

  return {
    facility,
    setFacility,
    validateError,
    error,
    loading,
    save,
    cancel,
    handleChange,
    successMessage,
    setSuccessMessage,
    setError,
    isDirty,
    ...formActions,
  };
}

export default useCreateFacility;
