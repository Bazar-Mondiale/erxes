import { IFieldGroup } from '@erxes/ui-forms/src/settings/properties/types';
import { GroupWrapper } from '@erxes/ui-segments/src/styles';
import {
  Button,
  CollapseContent,
  ControlLabel,
  FormControl,
  FormGroup,
  Icon,
  Tip,
} from '@erxes/ui/src/components';
import { MainStyleModalFooter as ModalFooter } from '@erxes/ui/src/styles/eindex';
import { FormColumn, FormWrapper } from '@erxes/ui/src/styles/main';
import { Alert, __, confirm } from '@erxes/ui/src/utils';
import React, { useState } from 'react';
import { IConfigsMap } from '../../types';

type Props = {
  configsMap: IConfigsMap;
  config: any;
  currentConfigKey: string;
  fieldGroups: IFieldGroup[];
  save: (configsMap: IConfigsMap) => void;
  delete: (currentConfigKey: string) => void;
};

const PerSettings: React.FC<Props> = (props) => {
  const [config, setConfig] = useState(props.config);
  const [rules, setRules] = useState(props.config.rules || []);
  const [hasOpen, setHasOpen] = useState(false);
  const { configsMap, currentConfigKey, save, fieldGroups } = props;

  const onSave = (e) => {
    e.preventDefault();
    const key = config.codeMask;
    const similarityGroup = { ...configsMap.similarityGroup };

    delete similarityGroup[currentConfigKey];
    similarityGroup[key] = { ...config, rules };
    save({ ...configsMap, similarityGroup });
  };

  const onDelete = (e) => {
    e.preventDefault();

    confirm(`This action will remove the config. Are you sure?`)
      .then(() => {
        props.delete(currentConfigKey);
      })
      .catch((error) => {
        Alert.error(error.message);
      });
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setConfig({ ...config, [name]: value });
  };

  const renderInput = (key: string, title?: string, description?: string) => {
    return (
      <FormGroup>
        <ControlLabel>{title || key}</ControlLabel>
        {description && <p>{__(description)}</p>}
        <FormControl
          name={key}
          defaultValue={config[key]}
          onChange={onChange}
          required={true}
        />
      </FormGroup>
    );
  };

  const addRule = () => {
    setRules([...rules, { id: Math.random().toString() }]);
  };

  const renderRules = () => {
    const onRemove = (id) => {
      setRules(rules.filter((c) => c.id !== id));
    };

    const editRule = (id, rule) => {
      const updated = (rules || []).map((r) =>
        r.id === id ? { ...r, ...rule } : r,
      );
      setRules(updated);
    };

    const onChangeControl = (id, e) => {
      const name = e.target.name;
      const value = e.target.value;
      editRule(id, { [name]: value });
    };

    const onChangeFieldGroup = (id, e) => {
      const name = e.target.name;
      const value = e.target.value;
      editRule(id, { [name]: value, fieldId: '' });
    };

    return (rules || []).map((rule) => (
      <GroupWrapper key={rule.id}>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <FormControl
                name="title"
                value={rule.title}
                onChange={onChangeControl.bind(this, rule.id)}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Field Group</ControlLabel>
              <FormControl
                name="groupId"
                componentClass="select"
                options={[
                  { value: '', label: 'Empty' },
                  ...(fieldGroups || []).map((fg) => ({
                    value: fg._id,
                    label: `${fg.code} - ${fg.name}`,
                  })),
                ]}
                value={rule.groupId}
                onChange={onChangeFieldGroup.bind(this, rule.id)}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Field</ControlLabel>
              <FormControl
                name="fieldId"
                componentClass="select"
                options={[
                  { value: '', label: 'Empty' },
                  ...(
                    (
                      (
                        (fieldGroups || []).find(
                          (fg) => fg._id === rule.groupId,
                        ) || {}
                      ).fields || []
                    ).filter((f) =>
                      [
                        'input',
                        'textarea',
                        'select',
                        'check',
                        'radio',
                        'customer',
                        'product',
                        'branch',
                        'department',
                        'map',
                      ].includes(f.type),
                    ) || []
                  ).map((f) => ({
                    value: f._id,
                    label: `${f.code} - ${f.text}`,
                  })),
                ]}
                value={rule.fieldId}
                onChange={onChangeControl.bind(this, rule.id)}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <Tip text={'Delete'}>
          <Button
            btnStyle="simple"
            size="small"
            onClick={onRemove.bind(this, rule.id)}
            icon="times"
          />
        </Tip>
      </GroupWrapper>
    ));
  };

  return (
    <CollapseContent
      title={__(config.title)}
      open={currentConfigKey === 'newSimilarityGroup' ? true : false}
      transparent={true}
      beforeTitle={<Icon icon="settings" />}
    >
      <FormWrapper>
        <FormColumn>{renderInput('title', 'Title', '')}</FormColumn>
        <FormColumn>{renderInput('codeMask', 'Code Mask', '')}</FormColumn>
      </FormWrapper>
      {renderRules()}
      <ModalFooter>
        <Button
          btnStyle="primary"
          onClick={addRule}
          icon="plus-circle"
          uppercase={false}
        >
          Add Rule
        </Button>
        <Button
          btnStyle="danger"
          icon="cancel-1"
          onClick={onDelete}
          uppercase={false}
        >
          Delete
        </Button>

        <Button
          btnStyle="success"
          icon="check-circle"
          onClick={onSave}
          uppercase={false}
          disabled={config.codeMask ? false : true}
        >
          Save
        </Button>
      </ModalFooter>
    </CollapseContent>
  );
};
export default PerSettings;
